<?php

namespace Filament\Upgrade\Commands;

use ReflectionClass;
use Filament\Facades\Filament;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
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

    public function handle(): int
    {
        $isDryRun = $this->option('dry-run');

        if ($isDryRun) {
            $this->info('Running in dry-run mode. No changes will be made.');
        }

        $this->info('Starting migration from Filament v3 to v4...');

        // Step 1: Download phpactor if it doesn't exist (skip in dry-run mode)
        if (! $isDryRun) {
            $this->downloadPhpactor();
        } else {
            $this->info('[DRY RUN] Would download phpactor to vendor/bin/phpactor.phar');
            $this->phpactorPath = base_path('vendor/bin/phpactor.phar');
        }

        // Step 2: Get all panels
        $panels = Filament::getPanels();
        $this->info('Found ' . count($panels) . ' panel(s)');

        foreach ($panels as $panel) {
            $this->info('Processing panel: ' . $panel->getId());

            // Step 3: Get all resources for this panel
            $resources = $panel->getResources();
            $this->info('Found ' . count($resources) . ' resource(s) in panel');

            foreach ($resources as $resourceClass) {
                $this->processResource($resourceClass, $isDryRun);
            }

            // Step 4: Get all clusters for this panel
            $clusters = $panel->getClusters();
            $this->info('Found ' . count($clusters) . ' cluster(s) in panel');

            foreach ($clusters as $clusterClass) {
                $this->processCluster($clusterClass, $isDryRun);
            }
        }

        if ($isDryRun) {
            $this->info('Dry run completed. Run without --dry-run to apply changes.');
        } else {
            $this->info('Migration completed successfully!');
        }

        return self::SUCCESS;
    }

    protected function downloadPhpactor(): void
    {
        $this->phpactorPath = base_path('vendor/bin/phpactor.phar');

        if (File::exists($this->phpactorPath)) {
            $this->info('Phpactor already exists at: ' . $this->phpactorPath);

            return;
        }

        $this->info('Downloading phpactor...');
        $process = Process::fromShellCommandline(
            'curl -Lo ' . $this->phpactorPath . ' https://github.com/phpactor/phpactor/releases/latest/download/phpactor.phar'
        );
        $process->run();

        if (! $process->isSuccessful()) {
            $this->error('Failed to download phpactor: ' . $process->getErrorOutput());

            throw new RuntimeException('Failed to download phpactor');
        }

        // Make phpactor executable
        chmod($this->phpactorPath, 0755);
        $this->info('Phpactor downloaded successfully to: ' . $this->phpactorPath);
    }

    /**
     * @param  class-string  $resourceClass
     */
    protected function processResource(string $resourceClass, bool $isDryRun = false): void
    {
        $this->info('Processing resource: ' . $resourceClass);

        // Get the base path for the resource
        $resourceReflection = new ReflectionClass($resourceClass);
        $resourcePath = $resourceReflection->getFileName();

        if ($resourcePath === false) {
            $this->warn("Could not get file path for resource: {$resourceClass}");

            return;
        }

        // Skip if the resource is in vendor directory
        if ($this->isVendorPath($resourcePath)) {
            $this->warn("Skipping resource in vendor directory: {$resourcePath}");

            return;
        }

        $resourceNamespace = $resourceReflection->getNamespaceName();
        $resourceBaseName = class_basename($resourceClass);

        // Extract directory information
        $resourceDir = dirname($resourcePath);

        // Determine the new directory name (pluralized)
        $resourceName = str_replace('Resource', '', $resourceBaseName);
        $pluralizedName = Str::plural($resourceName);

        // Create the new directory structure with the pluralized resource name
        $newResourceDir = $resourceDir . '/' . $pluralizedName;

        // Skip if the new resource directory would be in vendor
        if ($this->isVendorPath($newResourceDir)) {
            $this->warn("Skipping resource with destination in vendor directory: {$newResourceDir}");

            return;
        }

        $this->info("Resource will be moved from {$resourceDir} to {$newResourceDir}");

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
        $this->info('Processing cluster: ' . $clusterClass);

        // Get the base path for the cluster
        $clusterReflection = new ReflectionClass($clusterClass);
        $clusterPath = $clusterReflection->getFileName();

        if ($clusterPath === false) {
            $this->warn("Could not get file path for cluster: {$clusterClass}");

            return;
        }

        // Skip if the cluster is in vendor directory
        if ($this->isVendorPath($clusterPath)) {
            $this->warn("Skipping cluster in vendor directory: {$clusterPath}");

            return;
        }

        $clusterNamespace = $clusterReflection->getNamespaceName();
        $clusterBaseName = class_basename($clusterClass);

        // Extract directory information
        $clusterDir = dirname($clusterPath);

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
            $this->warn("Skipping cluster with destination in vendor directory: {$newClusterDir}");

            return;
        }

        $this->info("Cluster will be moved from {$clusterDir} to {$newClusterDir}");

        // Create the new directory if it doesn't exist
        if (! $isDryRun && ! File::exists($newClusterDir)) {
            File::makeDirectory($newClusterDir, 0755, true);
        } elseif ($isDryRun && ! File::exists($newClusterDir)) {
            $this->info("[DRY RUN] Would create directory: {$newClusterDir}");
        }

        // Move the cluster class
        $newClusterPath = $newClusterDir . '/' . $newClusterBaseName . '.php';
        $this->moveClass($clusterPath, $newClusterPath, $isDryRun);

        // Note: We don't process any other files for clusters as they are already in the correct place
        $this->info('Cluster processed successfully. No other files were moved as they are already in the correct place.');
    }

    protected function findAndMoveRelatedClasses(string $resourceClass, string $resourceDir, string $newResourceDir, string $resourceBaseName, bool $isDryRun = false): void
    {
        // Find all PHP files in the resource directory and subdirectories
        $files = $this->findPhpFiles($resourceDir);

        $this->info('Found ' . count($files) . ' file(s) in resource directory');

        $relatedFiles = [];
        foreach ($files as $file) {
            // Skip the resource file itself, we'll handle it separately
            if (basename($file) === $resourceBaseName . '.php') {
                continue;
            }

            // Only process files that are related to this resource
            // Check if the file path contains the resource basename directory
            if (strpos($file, $resourceDir . '/' . $resourceBaseName) === false) {
                $this->info("Skipping file not related to {$resourceBaseName}: {$file}");

                continue;
            }

            $relatedFiles[] = $file;
        }

        $this->info('Found ' . count($relatedFiles) . ' related file(s) for resource ' . $resourceBaseName);

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

            // Ensure the directory exists
            $newDir = dirname($newPath);
            if (! $isDryRun && ! File::exists($newDir)) {
                File::makeDirectory($newDir, 0755, true);
            } elseif ($isDryRun && ! File::exists($newDir)) {
                $this->info("[DRY RUN] Would create directory: {$newDir}");
            }

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
            $this->warn("Skipping vendor directory: {$directory}");

            return $files;
        }

        $items = File::allFiles($directory);

        foreach ($items as $item) {
            $pathname = $item->getPathname();

            // Skip files in vendor directory
            if ($this->isVendorPath($pathname)) {
                $this->info("Skipping vendor file: {$pathname}");

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
            $this->warn("Skipping file in vendor directory: {$sourcePath}");

            return;
        }

        if ($this->isVendorPath($destinationPath)) {
            $this->warn("Skipping move to vendor directory: {$destinationPath}");

            return;
        }

        // Ensure the destination directory exists
        $destinationDir = dirname($destinationPath);
        if (! $isDryRun && ! File::exists($destinationDir)) {
            File::makeDirectory($destinationDir, 0755, true);
        } elseif ($isDryRun && ! File::exists($destinationDir)) {
            $this->info("[DRY RUN] Would create directory: {$destinationDir}");
        }

        if ($isDryRun) {
            $this->info("[DRY RUN] Would move class from {$sourcePath} to {$destinationPath}");

            return;
        }

        $this->info("Moving class from {$sourcePath} to {$destinationPath}");

        try {
            // Use phpactor to move the class
            $process = Process::fromShellCommandline(
                "php {$this->phpactorPath} class:move {$sourcePath} {$destinationPath}"
            );
            $process->setTimeout(60); // Give it a minute to complete
            $process->run();

            if ($process->isSuccessful()) {
                $this->info("Successfully moved class from {$sourcePath} to {$destinationPath}");
            } else {
                $this->error('Failed to move class: ' . $process->getErrorOutput());
            }
        } catch (Exception $exception) {
            $this->error('Exception occurred while moving class: ' . $exception->getMessage());
        }
    }
}
