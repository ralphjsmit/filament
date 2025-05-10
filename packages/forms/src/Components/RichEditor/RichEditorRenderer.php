<?php

namespace Filament\Forms\Components\RichEditor;

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

    protected function processImages(): void
    {
        $disk = $this->imagesDisk ?? config('filament.default_filesystem_disk');
        $visibility = $this->imagesVisibility ?? ($disk === 'public' ? 'public' : 'private');

        $storage = Storage::disk($disk);

        $this->getEditor()->descendants(function (object &$node) use ($visibility, $storage): void {
            if ($node->type !== 'image') {
                return;
            }

            if (blank($node->attrs->{'data-id'} ?? null)) {
                return;
            }

            try {
                if (! $storage->exists($node->attrs->{'data-id'})) {
                    return;
                }
            } catch (UnableToCheckFileExistence $exception) {
                return;
            }

            if ($visibility === 'private') {
                try {
                    $node->attrs->src = $storage->temporaryUrl(
                        $node->attrs->{'data-id'},
                        now()->addMinutes(30)->endOfHour(),
                    );

                    return;
                } catch (Throwable $exception) {
                    // This driver does not support creating temporary URLs.
                }
            }

            $node->attrs->src = $storage->url($node->attrs->{'data-id'});
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
