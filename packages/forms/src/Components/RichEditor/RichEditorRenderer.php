<?php

namespace Filament\Forms\Components\RichEditor;

use Closure;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Support\Facades\Storage;
use League\Flysystem\UnableToCheckFileExistence;
use Throwable;
use Tiptap\Editor;

class RichEditorRenderer implements Htmlable
{
    protected Editor $editor;

    protected bool $hasProcessedImages = false;

    protected ?string $imagesDisk = null;

    protected ?string $imagesVisibility = null;

    protected ?Closure $getUploadedAttachmentUrlUsing = null;

    public function getEditor(): Editor
    {
        return $this->editor ??= app(Editor::class);
    }

    /**
     * @param  string | array<string, mixed>  $content
     */
    public function content(string | array $content): static
    {
        $this->getEditor()->setContent($content);
        $this->hasProcessedImages = false;

        return $this;
    }

    public function images(?string $disk = null, ?string $visibility = null): static
    {
        $this->imagesDisk = $disk;
        $this->imagesVisibility = $visibility;

        return $this;
    }

    public function getUploadedAttachmentUrlUsing(?Closure $callback): static
    {
        $this->getUploadedAttachmentUrlUsing = $callback;

        return $this;
    }

    public function getFileAttachmentUrl(mixed $file): ?string
    {
        if ($this->getUploadedAttachmentUrlUsing) {
            return ($this->getUploadedAttachmentUrlUsing)($file);
        }

        $disk = $this->imagesDisk ?? config('filament.default_filesystem_disk');
        $visibility = $this->imagesVisibility ?? ($disk === 'public' ? 'public' : 'private');

        $storage = Storage::disk($disk);

        try {
            if (! $storage->exists($file)) {
                return null;
            }
        } catch (UnableToCheckFileExistence $exception) {
            return null;
        }

        if ($visibility === 'private') {
            try {
                return $storage->temporaryUrl(
                    $file,
                    now()->addMinutes(30)->endOfHour(),
                );
            } catch (Throwable $exception) {
                // This driver does not support creating temporary URLs.
            }
        }

        return $storage->url($file);
    }

    protected function processImages(): void
    {
        $this->getEditor()->descendants(function (object &$node): void {
            if ($node->type !== 'image') {
                return;
            }

            if (blank($node->attrs->{'data-id'} ?? null)) {
                return;
            }

            $node->attrs->src = $this->getFileAttachmentUrl($node->attrs->{'data-id'});
        });

        $this->hasProcessedImages = true;
    }

    public function toHtml()
    {
        if ($this->hasProcessedImages) {
            $this->processImages();
        }

        return $this->getEditor()->getHTML();
    }
}
