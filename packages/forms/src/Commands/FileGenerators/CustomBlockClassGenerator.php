<?php

namespace Filament\Forms\Commands\FileGenerators;

use Filament\Actions\Action;
use Filament\Forms\Components\RichEditor\RichContentCustomBlock;
use Filament\Support\Commands\FileGenerators\ClassGenerator;
use Nette\PhpGenerator\ClassType;
use Nette\PhpGenerator\Method;

class CustomBlockClassGenerator extends ClassGenerator
{
    final public function __construct(
        protected string $fqn,
        protected string $view,
        protected string $previewView,
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
        return RichContentCustomBlock::class;
    }

    protected function addMethodsToClass(ClassType $class): void
    {
        $this->addGetIdMethodToClass($class);
        $this->addGetLabelMethodToClass($class);
        $this->addConfigureEditorActionMethodToClass($class);
        $this->addToPreviewHtmlMethodToClass($class);
        $this->addGetPreviewLabelMethodToClass($class);
        $this->addToHtmlMethodToClass($class);
    }

    protected function addGetIdMethodToClass(ClassType $class): void
    {
        $method = $class->addMethod('getId')
            ->setPublic()
            ->setStatic()
            ->setReturnType('string')
            ->setBody(
                <<<'PHP'
                return 'block id';
                PHP,
            );

        $this->configureConfigureMethod($method);
    }

    protected function addGetLabelMethodToClass(ClassType $class): void
    {
        $method = $class->addMethod('getLabel')
            ->setPublic()
            ->setStatic()
            ->setReturnType('string')
            ->setBody(
                <<<'PHP'
                return 'block label';
                PHP,
            );

        $this->configureConfigureMethod($method);
    }

    protected function addConfigureEditorActionMethodToClass(ClassType $class): void
    {
        $method = $class->addMethod('configureEditorAction')
            ->setPublic()
            ->setStatic()
            ->setReturnType(Action::class)
            ->setBody(
                <<<'PHP'
                return $action
                    ->modalDescription('Configure the block')
                    ->schema([
                        //
                    ]);
                PHP,
            );
        $method->addParameter('action')
            ->setType(Action::class);

        $this->configureConfigureMethod($method);
    }

    protected function addToPreviewHtmlMethodToClass(ClassType $class): void
    {
        $method = $class->addMethod('toPreviewHtml')
            ->setPublic()
            ->setStatic()
            ->setReturnType('string')
            ->setBody(
                <<<PHP
                return view('{$this->previewView}', [
                    //
                ])->render();
                PHP,
            );
        $method->addParameter('config')
            ->setType('array');

        $this->configureConfigureMethod($method);
    }

    protected function addGetPreviewLabelMethodToClass(ClassType $class): void
    {
        $method = $class->addMethod('getPreviewLabel')
            ->setPublic()
            ->setStatic()
            ->setReturnType('string')
            ->setBody(
                <<<'PHP'
                return 'block preview label';
                PHP,
            );
        $method->addParameter('config')
            ->setType('array');

        $this->configureConfigureMethod($method);
    }

    protected function addToHtmlMethodToClass(ClassType $class): void
    {
        $method = $class->addMethod('toHtml')
            ->setPublic()
            ->setStatic()
            ->setReturnType('string')
            ->setBody(
                <<<PHP
                return view('{$this->view}', [
                    //
                ])->render();
                PHP,
            );
        $method->addParameter('config')
            ->setType('array');
        $method->addParameter('data')
            ->setType('array');

        $this->configureConfigureMethod($method);
    }

    protected function configureConfigureMethod(Method $method): void {}

    public function getFqn(): string
    {
        return $this->fqn;
    }

    public function getView(): ?string
    {
        return $this->view;
    }
}
