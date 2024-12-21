<?php

namespace Filament\Actions\Concerns;

use Closure;
use Filament\Notifications\Notification;
use Illuminate\Auth\Access\Response;

trait CanNotify
{
    protected Notification | Closure | null $failureNotification = null;

    protected Notification | Closure | null $successNotification = null;

    protected Notification | Closure | null $unauthorizedNotification = null;

    protected string | Closure | null $failureNotificationTitle = null;

    protected string | Closure | null $successNotificationTitle = null;

    protected string | Closure | null $unauthorizedNotificationTitle = null;

    protected string | Closure | null $failureNotificationBody = null;

    protected string | Closure | null $failureNotificationMissingMessage = null;

    /**
     * @param  array<string>  $messages
     */
    public function sendFailureNotification(int $successCount = 0, int $totalCount = 0, int $missingMessageCount = 0, array $messages = []): static
    {
        $notification = $this->evaluate($this->failureNotification, [
            'isPartial' => $successCount > 0,
            'messages' => $messages,
            'missingMessageCount' => $missingMessageCount,
            'notification' => $notification = Notification::make()
                ->when(
                    $successCount,
                    fn (Notification $notification) => $notification->warning(),
                    fn (Notification $notification) => $notification->danger(),
                )
                ->title($this->getFailureNotificationTitle($successCount, $totalCount, $missingMessageCount, $messages))
                ->body($this->getFailureNotificationBody($successCount, $totalCount, $missingMessageCount, $messages))
                ->persistent(),
            'successCount' => $successCount,
            'totalCount' => $totalCount,
        ]) ?? $notification;

        if (filled($notification?->getTitle())) {
            $notification->send();
        }

        return $this;
    }

    public function failureNotification(Notification | Closure | null $notification): static
    {
        $this->failureNotification = $notification;

        return $this;
    }

    /**
     * @deprecated Use `failureNotificationTitle()` instead.
     */
    public function failureNotificationMessage(string | Closure | null $message): static
    {
        return $this->failureNotificationTitle($message);
    }

    public function failureNotificationTitle(string | Closure | null $title): static
    {
        $this->failureNotificationTitle = $title;

        return $this;
    }

    public function failureNotificationBody(string | Closure | null $body): static
    {
        $this->failureNotificationBody = $body;

        return $this;
    }

    public function failureNotificationMissingMessage(string | Closure | null $message): static
    {
        $this->failureNotificationMissingMessage = $message;

        return $this;
    }

    public function sendSuccessNotification(): static
    {
        $notification = $this->evaluate($this->successNotification, [
            'notification' => $notification = Notification::make()
                ->success()
                ->title($this->getSuccessNotificationTitle()),
        ]) ?? $notification;

        if (filled($notification?->getTitle())) {
            $notification->send();
        }

        return $this;
    }

    public function successNotification(Notification | Closure | null $notification): static
    {
        $this->successNotification = $notification;

        return $this;
    }

    /**
     * @deprecated Use `successNotificationTitle()` instead.
     */
    public function successNotificationMessage(string | Closure | null $message): static
    {
        return $this->successNotificationTitle($message);
    }

    public function successNotificationTitle(string | Closure | null $title): static
    {
        $this->successNotificationTitle = $title;

        return $this;
    }

    public function sendUnauthorizedNotification(Response $response): static
    {
        $notification = $this->evaluate($this->unauthorizedNotification, [
            'notification' => $notification = Notification::make()
                ->danger()
                ->title($this->getUnauthorizedNotificationTitle() ?? $response->message())
                ->persistent(),
        ]) ?? $notification;

        if (filled($notification?->getTitle())) {
            $notification->send();
        }

        return $this;
    }

    public function unauthorizedNotification(Notification | Closure | null $notification): static
    {
        $this->unauthorizedNotification = $notification;

        return $this;
    }

    public function unauthorizedNotificationTitle(string | Closure | null $title): static
    {
        $this->unauthorizedNotificationTitle = $title;

        return $this;
    }

    public function getSuccessNotificationTitle(): ?string
    {
        return $this->evaluate($this->successNotificationTitle);
    }

    /**
     * @param  array<string>  $messages
     */
    public function getFailureNotificationTitle(int $successCount = 0, int $totalCount = 0, int $missingMessageCount = 0, array $messages = []): ?string
    {
        return $this->evaluate($this->failureNotificationTitle, [
            'isPartial' => $successCount > 0,
            'messages' => $messages,
            'missingMessageCount' => $missingMessageCount,
            'successCount' => $successCount,
            'totalCount' => $totalCount,
        ]);
    }

    /**
     * @param  array<string>  $messages
     */
    public function getFailureNotificationBody(int $successCount = 0, int $totalCount = 0, int $missingMessageCount = 0, array $messages = []): ?string
    {
        return $this->evaluate($this->failureNotificationBody, [
            'isPartial' => $successCount > 0,
            'messages' => $messages,
            'missingMessageCount' => $missingMessageCount,
            'successCount' => $successCount,
            'totalCount' => $totalCount,
        ]) ?? implode(
            ' ',
            [
                ...($missingMessageCount ? [$this->getFailureNotificationMissingMessage($successCount, $totalCount, $missingMessageCount, $messages)] : []),
                ...$messages,
            ],
        );
    }

    /**
     * @param  array<string>  $messages
     */
    public function getFailureNotificationMissingMessage(int $successCount = 0, int $totalCount = 0, int $missingMessageCount = 0, array $messages = []): ?string
    {
        return $this->evaluate($this->failureNotificationMissingMessage, [
            'isPartial' => $successCount > 0,
            'messages' => $messages,
            'missingMessageCount' => $missingMessageCount,
            'successCount' => $successCount,
            'totalCount' => $totalCount,
        ]);
    }

    public function getUnauthorizedNotificationTitle(): ?string
    {
        return $this->evaluate($this->unauthorizedNotificationTitle);
    }
}
