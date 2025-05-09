<?php

namespace Filament\Forms\Components\Concerns;

use Closure;
use Filament\Support\Components\Attributes\ExposedLivewireMethod;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;
use League\Flysystem\UnableToCheckFileExistence;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;
use Throwable;

trait HasFileAttachments
{
    protected string | Closure | null $fileAttachmentsDirectory = null;

    protected string | Closure | null $fileAttachmentsDiskName = null;

    protected ?Closure $getUploadedAttachmentUrlUsing = null;

    protected ?Closure $saveUploadedFileAttachmentsUsing = null;

    protected string | Closure $fileAttachmentsVisibility = 'public';

    public function fileAttachmentsDirectory(string | Closure | null $directory): static
    {
        $this->fileAttachmentsDirectory = $directory;

        return $this;
    }

    public function fileAttachmentsDisk(string | Closure | null $name): static
    {
        $this->fileAttachmentsDiskName = $name;

        return $this;
    }

    #[ExposedLivewireMethod]
    public function getUploadedFileAttachmentTemporaryUrl(TemporaryUploadedFile | string | null $attachment = null): ?string
    {
        return $this->getUploadedFileAttachment($attachment)?->temporaryUrl();
    }

    public function getUploadedFileAttachment(TemporaryUploadedFile | string | null $attachment = null): ?TemporaryUploadedFile
    {
        if (is_string($attachment)) {
            $attachment = data_get($this->getLivewire(), "componentFileAttachments.{$this->getStatePath()}.{$attachment}");
        } elseif (! $attachment) {
            $attachment = data_get($this->getLivewire(), "componentFileAttachments.{$this->getStatePath()}");
        }

        return $attachment;
    }

    public function storeUploadedFileAttachment(TemporaryUploadedFile $file): mixed
    {
        if ($callback = $this->saveUploadedFileAttachmentsUsing) {
            return $this->evaluate($callback, [
                'file' => $file,
            ]);
        }

        $storeMethod = $this->getFileAttachmentsVisibility() === 'public' ? 'storePublicly' : 'store';

        return $file->{$storeMethod}($this->getFileAttachmentsDirectory(), $this->getFileAttachmentsDiskName());
    }

    #[ExposedLivewireMethod]
    public function saveUploadedFileAttachment(TemporaryUploadedFile | string | null $attachment = null): ?string
    {
        $attachment = $this->getUploadedFileAttachment($attachment);

        if (! $attachment) {
            return null;
        }

        $file = $this->storeUploadedFileAttachment($attachment);

        return $this->getFileAttachmentUrl($file);
    }

    public function fileAttachmentsVisibility(string | Closure $visibility): static
    {
        $this->fileAttachmentsVisibility = $visibility;

        return $this;
    }

    public function getUploadedAttachmentUrlUsing(?Closure $callback): static
    {
        $this->getUploadedAttachmentUrlUsing = $callback;

        return $this;
    }

    public function saveUploadedFileAttachmentsUsing(?Closure $callback): static
    {
        $this->saveUploadedFileAttachmentsUsing = $callback;

        return $this;
    }

    public function getFileAttachmentsDirectory(): ?string
    {
        return $this->evaluate($this->fileAttachmentsDirectory);
    }

    public function getFileAttachmentsDisk(): Filesystem
    {
        return Storage::disk($this->getFileAttachmentsDiskName());
    }

    public function getFileAttachmentsDiskName(): string
    {
        $name = $this->evaluate($this->fileAttachmentsDiskName);

        if (filled($name)) {
            return $name;
        }

        $name = config('filament.default_filesystem_disk');

        if ($name !== 'local') {
            return $name;
        }

        if ($this->getFileAttachmentsVisibility() !== 'public') {
            return $name;
        }

        return 'public';
    }

    public function getFileAttachmentsVisibility(): string
    {
        return $this->evaluate($this->fileAttachmentsVisibility);
    }

    public function getFileAttachmentUrl(mixed $file): ?string
    {
        if ($callback = $this->getUploadedAttachmentUrlUsing) {
            return $this->evaluate($callback, [
                'file' => $file,
            ]);
        }

        /** @var FilesystemAdapter $storage */
        $storage = $this->getFileAttachmentsDisk();

        try {
            if (! $storage->exists($file)) {
                return null;
            }
        } catch (UnableToCheckFileExistence $exception) {
            return null;
        }

        if ($this->getFileAttachmentsVisibility() === 'private') {
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
}
