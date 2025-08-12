<?php

namespace Filament\Upgrade\Commands;

use Exception;
use ReflectionClass;
use RuntimeException;
use Filament\Facades\Filament;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Str;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Input\InputOption;

#[AsCommand(name: 'filament:upgrade-directory-structure-to-v4')]
class UpgradeDirectoryStructureToV4Command extends Command
{
    protected $description = 'Upgrade Filament directory structure from v3 to v4';

    protected $name = 'filament:upgrade-directory-structure-to-v4';

    protected string $phpactorPath;

    /**
     * @var array<string, array<string, string>>
     */
    protected array $movedFiles = [];

    protected ?string $currentResource = null;

    /**
     * @return array<InputOption>
     */
    protected function getOptions(): array
    {
        return [
            new InputOption(
                name: 'dry-run',
                shortcut: 'D',
                mode: InputOption::VALUE_NONE,
                description: 'Preview changes without executing them',
            ),
        ];
    }

    protected function formatPath(string $path): string
    {
        return str_replace(base_path() . '/', '', $path);
    }

    public function handle(): int
    {
        $isDryRun = $this->option('dry-run');

        // Ask for confirmation if not in dry-run mode
        if (! $isDryRun && ! $this->components->confirm('This command will modify your Filament resources and clusters to match the new v4 directory structure. Please commit any changes you have made to your project before continuing. Do you want to continue?', default: true)) {
            $this->components->info('Migration cancelled.');
            return self::FAILURE;
        }

        $this->components->info('Starting migration from Filament v3 to v4...');

        if ($isDryRun) {
            $this->newLine();
            $this->components->info('Running in dry-run mode. No changes will be made.');
            $this->newLine();
        }

        // Step 1: Download phpactor if it doesn't exist (skip in dry-run mode)
        if (! $isDryRun) {
            $this->downloadPhpactor();
        } else {
            $this->phpactorPath = base_path('vendor/bin/phpactor.phar');
        }

        // Step 2: Get all panels
        $panels = Filament::getPanels();
        foreach ($panels as $panel) {
            // Step 3: Get all resources for this panel
            $resources = $panel->getResources();

            if (count($resources) > 0) {
                $this->components->info('Processing resources in ' . $panel->getId() . ' panel');

                foreach ($resources as $resourceClass) {
                    $this->processResource($resourceClass, $isDryRun);
                }

                $this->newLine();
            }

            // Step 4: Get all clusters for this panel
            $clusters = $panel->getClusters();

            if (count($clusters) > 0) {
                $this->components->info('Processing resources in ' . $panel->getId() . ' panel');

                foreach ($clusters as $clusterClass) {
                    $this->processCluster($clusterClass, $isDryRun);
                }

                $this->newLine();
            }
        }


        if ($isDryRun) {
            $this->components->info('Dry run completed. Run without --dry-run to apply changes.');
        } else {
            $this->components->info('Migration completed successfully!');
        }

        return self::SUCCESS;
    }

    protected function downloadPhpactor(): void
    {
        $this->phpactorPath = base_path('vendor/bin/phpactor.phar');

        if (File::exists($this->phpactorPath)) {
            $this->components->info('Phpactor already exists at: ' . $this->formatPath($this->phpactorPath));
            return;
        }

        $this->components->task('Downloading phpactor', function () {
            $process = Process::command(
                'curl -Lo ' . $this->phpactorPath . ' https://github.com/phpactor/phpactor/releases/latest/download/phpactor.phar'
            );
            $process = $process->run();

            if (! $process->successful()) {
                $this->error('Failed to download phpactor: ' . $process->errorOutput());
                throw new RuntimeException('Failed to download phpactor');
            }

            // Make phpactor executable
            chmod($this->phpactorPath, 0755);
            return true;
        });
    }

    /**
     * @param  class-string  $resourceClass
     */
    protected function processResource(string $resourceClass, bool $isDryRun = false): void
    {
        // Get the base path for the resource
        $resourceReflection = new ReflectionClass($resourceClass);
        $resourcePath = $resourceReflection->getFileName();

        if ($resourcePath === false) {
            $this->components->warn("Could not get file path for resource: {$resourceClass}");
            return;
        }

        // Skip if the resource is in vendor directory
        if ($this->isVendorPath($resourcePath)) {
            $this->components->warn("Skipping resource in vendor directory");
            return;
        }

        $resourceBaseName = class_basename($resourceClass);
        $resourceDir = dirname($resourcePath);

        // Set the current resource being processed
        $this->currentResource = $resourceBaseName;

        // Determine the new directory name (pluralized)
        $resourceName = str_replace('Resource', '', $resourceBaseName);
        $pluralizedName = Str::plural($resourceName);

        // Create the new directory structure with the pluralized resource name
        $newResourceDir = $resourceDir . '/' . $pluralizedName;

        // Skip if the new resource directory would be in vendor
        if ($this->isVendorPath($newResourceDir)) {
            $this->components->warn("Skipping resource with destination in vendor directory");
            return;
        }

        // Find all related classes
        $this->findAndMoveRelatedClasses($resourceClass, $resourceDir, $newResourceDir, $resourceBaseName, $isDryRun);

        // Move the resource itself
        $newResourcePath = $newResourceDir . '/' . $resourceBaseName . '.php';
        $this->moveClass($resourcePath, $newResourcePath, $isDryRun);
    }

    /**
     * @param  class-string  $clusterClass
     */
    protected function processCluster(string $clusterClass, bool $isDryRun = false): void
    {
        // Get the base path for the cluster
        $clusterReflection = new ReflectionClass($clusterClass);
        $clusterPath = $clusterReflection->getFileName();

        if ($clusterPath === false) {
            $this->components->warn("Could not get file path for cluster: {$clusterClass}");
            return;
        }

        // Skip if the cluster is in vendor directory
        if ($this->isVendorPath($clusterPath)) {
            $this->components->warn("Skipping cluster in vendor directory");
            return;
        }

        $clusterBaseName = class_basename($clusterClass);
        $clusterDir = dirname($clusterPath);

        // Set the current resource being processed (in this case, a cluster)
        $this->currentResource = $clusterBaseName;

        // Determine if the cluster name ends with "Cluster"
        $endsWithCluster = Str::endsWith($clusterBaseName, 'Cluster');

        // Determine the new class name and directory
        if ($endsWithCluster) {
            // If it already ends with Cluster, keep the same name
            $newClusterBaseName = $clusterBaseName;
            $newClusterDir = $clusterDir . '/' . $clusterBaseName;
        } else {
            // If it doesn't end with Cluster, add Cluster to the end
            $newClusterBaseName = $clusterBaseName . 'Cluster';
            $newClusterDir = $clusterDir . '/' . $clusterBaseName;
        }

        // Skip if the new cluster directory would be in vendor
        if ($this->isVendorPath($newClusterDir)) {
            $this->components->warn("Skipping cluster with destination in vendor directory");
            return;
        }


        // Move the cluster class
        $newClusterPath = $newClusterDir . '/' . $newClusterBaseName . '.php';
        $this->moveClass($clusterPath, $newClusterPath, $isDryRun);
    }

    protected function findAndMoveRelatedClasses(string $resourceClass, string $resourceDir, string $newResourceDir, string $resourceBaseName, bool $isDryRun = false): void
    {
        // Find all PHP files in the resource directory and subdirectories
        $files = $this->findPhpFiles($resourceDir);

        $relatedFiles = [];
        foreach ($files as $file) {
            // Skip the resource file itself, we'll handle it separately
            if (basename($file) === $resourceBaseName . '.php') {
                continue;
            }

            // Only process files that are related to this resource
            // Check if the file path contains the resource basename directory
            if (strpos($file, $resourceDir . '/' . $resourceBaseName) === false) {
                continue;
            }

            $relatedFiles[] = $file;
        }

        foreach ($relatedFiles as $file) {
            // Determine the new path for this file
            $relativePath = str_replace($resourceDir, '', $file);

            // Check if the relative path starts with /{ResourceBaseName}/
            $resourceDirPattern = '/' . $resourceBaseName . '/';
            if (strpos($relativePath, $resourceDirPattern) === 0) {
                // Remove the resource basename directory from the path
                $relativePath = substr($relativePath, strlen($resourceDirPattern));
                // Add a slash before the remaining path
                $relativePath = '/' . $relativePath;
            }

            $newPath = $newResourceDir . $relativePath;


            // Move the class
            $this->moveClass($file, $newPath, $isDryRun);
        }
    }

    /**
     * Check if a path is in the vendor directory
     */
    protected function isVendorPath(string $path): bool
    {
        return str_contains($path, '/vendor/');
    }

    /**
     * Find all PHP files in a directory
     *
     * @param  string  $directory  The directory to search in
     * @return array<int, string> Array of file paths
     */
    protected function findPhpFiles(string $directory): array
    {
        $files = [];

        if (! File::exists($directory)) {
            return $files;
        }

        // Skip if the directory is in vendor
        if ($this->isVendorPath($directory)) {
            return $files;
        }

        $items = File::allFiles($directory);

        foreach ($items as $item) {
            $pathname = $item->getPathname();

            // Skip files in vendor directory
            if ($this->isVendorPath($pathname)) {
                continue;
            }

            if ($item->getExtension() === 'php') {
                $files[] = $pathname;
            }
        }

        return $files;
    }

    protected function moveClass(string $sourcePath, string $destinationPath, bool $isDryRun = false): void
    {
        // Safety check: Never touch files in the vendor directory
        if ($this->isVendorPath($sourcePath)) {
            $this->components->warn("Skipping file in vendor directory");
            return;
        }

        if ($this->isVendorPath($destinationPath)) {
            $this->components->warn("Skipping move to vendor directory");
            return;
        }


        if ($isDryRun) {
            // Display resource grouping information in real-time for dry runs
            // If this is the first file for this resource, display the resource heading
            if ($this->currentResource && (!isset($this->movedFiles[$this->currentResource]) || empty($this->movedFiles[$this->currentResource]))) {
                $this->line('  <fg=yellow;options=bold>' . $this->currentResource . '</>');
                $this->movedFiles[$this->currentResource] = [];
            } elseif (!$this->currentResource && (!isset($this->movedFiles['Other']) || empty($this->movedFiles['Other']))) {
                $this->line('  <fg=yellow;options=bold>Other</>');
                $this->movedFiles['Other'] = [];
            }

            // Display the file move information with proper indentation
            $this->line('    • ' . $this->formatPath($sourcePath) . ' → ' . $this->formatPath($destinationPath));

            // Track the file for resource grouping
            if ($this->currentResource) {
                $this->movedFiles[$this->currentResource][$sourcePath] = $destinationPath;
            } else {
                $this->movedFiles['Other'][$sourcePath] = $destinationPath;
            }
            return;
        }

        try {
            // Use phpactor to move the class
            $process = Process::command(
                "php {$this->phpactorPath} class:move {$sourcePath} {$destinationPath}"
            );
            $process->timeout(60); // Give it a minute to complete
            $process = $process->run();

            if ($process->successful()) {
                // Display resource grouping information in real-time for actual moves
                // If this is the first file for this resource, display the resource heading
                if ($this->currentResource && (!isset($this->movedFiles[$this->currentResource]) || empty($this->movedFiles[$this->currentResource]))) {
                    $this->line('  <fg=yellow;options=bold>' . $this->currentResource . '</>');
                    $this->movedFiles[$this->currentResource] = [];
                } elseif (!$this->currentResource && (!isset($this->movedFiles['Other']) || empty($this->movedFiles['Other']))) {
                    $this->line('  <fg=yellow;options=bold>Other</>');
                    $this->movedFiles['Other'] = [];
                }

                // Display the file move information with proper indentation
                $this->line('    • ' . $this->formatPath($sourcePath) . ' → ' . $this->formatPath($destinationPath));

                // Track the file for resource grouping
                if ($this->currentResource) {
                    $this->movedFiles[$this->currentResource][$sourcePath] = $destinationPath;
                } else {
                    $this->movedFiles['Other'][$sourcePath] = $destinationPath;
                }
            } else {
                $this->components->error('Failed to move class: ' . $process->errorOutput());
            }
        } catch (Exception $exception) {
            $this->components->error('Exception occurred while moving class: ' . $exception->getMessage());
        }
    }
}
