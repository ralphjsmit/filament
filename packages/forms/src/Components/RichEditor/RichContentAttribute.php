<?php

namespace Filament\Forms\Components\RichEditor;

use Filament\Forms\Components\RichEditor\FileAttachmentProviders\Contracts\FileAttachmentProvider;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Database\Eloquent\Model;
use Tiptap\Core\Extension;

class RichContentAttribute implements Htmlable
{
    protected ?string $fileAttachmentsDisk = null;

    protected ?string $fileAttachmentsVisibility = null;

    /**
     * @var array<Extension>
     */
    protected array $tipTapPhpExtensions = [];

    protected ?FileAttachmentProvider $fileAttachmentProvider = null;

    public function __construct(protected Model $model, protected string $name) {}

    public static function make(Model $model, string $name): static
    {
        return app(static::class, ['model' => $model, 'name' => $name]);
    }

    public function fileAttachments(?string $disk = null, ?string $visibility = null): static
    {
        if (class_exists($disk) && is_a($disk, FileAttachmentProvider::class, allow_string: true)) {

        }

        $this->fileAttachmentsDisk = $disk;
        $this->fileAttachmentsVisibility = $visibility;

        return $this;
    }

    public function getFileAttachmentsDisk(): ?string
    {
        return $this->fileAttachmentsDisk;
    }

    public function getFileAttachmentsVisibility(): ?string
    {
        return $this->fileAttachmentsVisibility ?? $this->getFileAttachmentProvider()?->getDefaultFileAttachmentVisibility();
    }

    /**
     * @param  array<Extension>  $extensions
     */
    public function tipTapPhpExtensions(array $extensions): static
    {
        $this->tipTapPhpExtensions = [
            ...$this->tipTapPhpExtensions,
            ...$extensions,
        ];

        return $this;
    }

    /**
     * @return array<Extension>
     */
    public function getTipTapPhpExtensions(): array
    {
        return $this->tipTapPhpExtensions;
    }

    public function fileAttachmentProvider(?FileAttachmentProvider $provider): static
    {
        $this->fileAttachmentProvider = $provider?->attribute($this);

        return $this;
    }

    public function getFileAttachmentProvider(): ?FileAttachmentProvider
    {
        return $this->fileAttachmentProvider;
    }

    public function getModel(): Model
    {
        return $this->model;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function toHtml(): string
    {
        return app(RichContentRenderer::class)
            ->tipTapPhpExtensions($this->getTipTapPhpExtensions())
            ->content($this->model->getAttribute($this->name))
            ->fileAttachments($this->getFileAttachmentsDisk(), $this->getFileAttachmentsVisibility())
            ->fileAttachmentProvider($this->getFileAttachmentProvider())
            ->toHtml();
    }
}
