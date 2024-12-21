<?php

namespace Filament\Commands\FileGenerators;

use Filament\Clusters\Cluster;
use Filament\Support\Commands\FileGenerators\ClassGenerator;
use Nette\PhpGenerator\ClassType;
use Nette\PhpGenerator\Property;

class ClusterClassGenerator extends ClassGenerator
{
    final public function __construct(
        protected string $fqn,
    ) {}

    public function getNamespace(): string
    {
        return $this->extractNamespace($this->getFqn());
    }

    /**
     * @return array<string>
     */
    public function getImports(): array
    {
        return [
            $this->getExtends(),
        ];
    }

    public function getBasename(): string
    {
        return class_basename($this->getFqn());
    }

    public function getExtends(): string
    {
        return Cluster::class;
    }

    protected function addPropertiesToClass(ClassType $class): void
    {
        $this->addNavigationIconPropertyToClass($class);
    }

    protected function addNavigationIconPropertyToClass(ClassType $class): void
    {
        $property = $class->addProperty('navigationIcon', 'heroicon-o-squares-2x2')
            ->setProtected()
            ->setStatic()
            ->setType('?string');
        $this->configureNavigationIconProperty($property);
    }

    protected function configureNavigationIconProperty(Property $property): void {}

    public function getFqn(): string
    {
        return $this->fqn;
    }
}
