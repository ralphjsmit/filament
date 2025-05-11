<?php

namespace Filament\Forms\Components\RichEditor\FileAttachmentProviders;

use Exception;
use Filament\Forms\Components\RichEditor\FileAttachmentProviders\Contracts\FileAttachmentProvider;
use Filament\Forms\Components\RichEditor\RichContentAttribute;
use Illuminate\Support\Str;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection;
use Throwable;

class SpatieMediaLibraryFileAttachmentProvider implements FileAttachmentProvider
{
    protected MediaCollection $media;

    protected RichContentAttribute $attribute;

    public static function make(): static
    {
        return app(static::class);
    }

    public function attribute(RichContentAttribute $attribute): static
    {
        $this->attribute = $attribute;

        return $this;
    }

    public function getExistingModel(): ?HasMedia
    {
        $model = $this->attribute->getModel();

        if (! $model->exists) {
            return null;
        }

        if (! ($model instanceof HasMedia)) {
            throw new Exception('The [' . static::class . '] requires the model to implement the [' . HasMedia::class . '] interface from the Spatie Media Library package.');
        }

        return $model;
    }

    public function getMedia(): ?MediaCollection
    {
        if (isset($this->media)) {
            return $this->media;
        }

        /** @var MediaCollection $media */
        $media = $this->getExistingModel()?->getMedia(collectionName: $this->attribute->getName())->keyBy('uuid');

        return $this->media = $media;
    }

    public function getFileAttachmentUrl(mixed $file): ?string
    {
        $media = $this->getMedia();

        if (! $media) {
            return null;
        }

        if (! $media->has($file)) {
            return null;
        }

        $image = $media->get($file);

        if ($this->attribute->getFileAttachmentsVisibility() === 'private') {
            try {
                return $image->getTemporaryUrl(
                    now()->addMinutes(30)->endOfHour(),
                );
            } catch (Throwable $exception) {
                // This driver does not support creating temporary URLs.
            }
        }

        return $image->getUrl();
    }

    public function saveUploadedFileAttachment(TemporaryUploadedFile $file): mixed
    {
        return $this->getExistingModel() /** @phpstan-ignore method.notFound */
            ->addMediaFromString($file->get())
            ->usingFileName(((string) Str::ulid()) . '.' . $file->getClientOriginalExtension())
            ->toMediaCollection($this->attribute->getName(), diskName: $this->attribute->getFileAttachmentsDisk() ?? '')
            ->uuid;
    }

    /**
     * @param  array<mixed>  $exceptIds
     */
    public function cleanUpFileAttachments(array $exceptIds): void
    {
        $model = $this->getExistingModel();
        $collectionName = $this->attribute->getName();

        $model->clearMediaCollectionExcept(
            $collectionName,
            $model->getMedia($collectionName)->whereIn('uuid', $exceptIds),
        );
    }

    public function getDefaultFileAttachmentVisibility(): ?string
    {
        return 'private';
    }

    public function isExistingRecordRequiredToSaveNewFileAttachments(): bool
    {
        return true;
    }
}
