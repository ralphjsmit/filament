<?php

namespace Filament\Actions\Concerns;

use Closure;
use Exception;
use Filament\Support\Authorization\Denial;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

trait InteractsWithSelectedRecords
{
    protected bool | Closure $canAccessSelectedRecords = false;

    protected int $totalSelectedRecordsCount = 0;

    protected int $successfulSelectedRecordsCount = 0;

    protected int $authorizationFailureWithoutMessageSelectedRecordsCount = 0;

    protected int $processingFailureWithoutMessageSelectedRecordsCount = 0;

    /**
     * @var array<string>
     */
    protected array $selectedRecordsAuthorizationFailureMessages = [];

    /**
     * @var array<string, array{message: string | Closure, count: int}>
     */
    protected array $selectedRecordsProcessingFailureMessages = [];

    public function accessSelectedRecords(bool | Closure $condition = true): static
    {
        $this->canAccessSelectedRecords = $condition;

        return $this;
    }

    public function canAccessSelectedRecords(): bool
    {
        return (bool) $this->evaluate($this->canAccessSelectedRecords);
    }

    public function getSelectedRecords(): EloquentCollection | Collection
    {
        if (! $this->canAccessSelectedRecords()) {
            throw new Exception("The action [{$this->getName()}] is attempting to access the selected records from the table, but it is not using [accessSelectedRecords()], so they are not available.");
        }

        $records = $this->getLivewire()->getSelectedTableRecords($this->shouldFetchSelectedRecords());

        $this->totalSelectedRecordsCount = $records->count();
        $this->successfulSelectedRecordsCount = $this->totalSelectedRecordsCount;

        if (! $this->shouldAuthorizeIndividualRecords()) {
            return $records;
        }

        $authorizationResponses = [];
        $failureCountsByAuthorizationResponse = [];
        $failureCountWithoutAuthorizationResponse = 0;

        foreach ($records as $recordIndex => $record) {
            $response = $this->getIndividualRecordAuthorizationResponse($record);

            if ($response->allowed()) {
                continue;
            }

            if ($response instanceof Denial) {
                $responseKey = $response->getKey();

                $authorizationResponses[$responseKey] ??= $response;
                $failureCountsByAuthorizationResponse[$responseKey] ??= 0;
                $failureCountsByAuthorizationResponse[$responseKey]++;
            } elseif (filled($responseMessage = $response->message())) {
                $responseKey = array_search($responseMessage, $authorizationResponses);

                if ($responseKey === false) {
                    $authorizationResponses[] = $responseMessage;
                    $responseKey = array_key_last($authorizationResponses);
                    $failureCountsByAuthorizationResponse[$responseKey] = 0;
                }

                $failureCountsByAuthorizationResponse[$responseKey]++;
            } else {
                $failureCountWithoutAuthorizationResponse++;
            }

            $records->offsetUnset($recordIndex);
            $this->successfulSelectedRecordsCount--;
        }

        $failureMessages = [];

        if ($this->totalSelectedRecordsCount > $this->successfulSelectedRecordsCount) {
            foreach ($authorizationResponses as $responseKey => $response) {
                if ($response instanceof Denial) {
                    $failureMessages[] = $response->message($failureCountsByAuthorizationResponse[$responseKey], $this->totalSelectedRecordsCount);
                } else {
                    $failureMessages[] = $response;
                }
            }
        }

        $this->authorizationFailureWithoutMessageSelectedRecordsCount = $failureCountWithoutAuthorizationResponse;
        $this->selectedRecordsAuthorizationFailureMessages = $failureMessages;

        return $records;
    }

    public function reportRecordProcessingFailure(?string $key = null, string | Closure | null $message = null): void
    {
        if (filled($key)) {
            $this->selectedRecordsProcessingFailureMessages[$key] = [
                'message' => $message,
                'count' => $this->selectedRecordsProcessingFailureMessages[$key]['count'] ?? 0,
            ];
        } else {
            $this->processingFailureWithoutMessageSelectedRecordsCount++;
        }

        $this->successfulSelectedRecordsCount--;
    }

    /**
     * @return array<string>
     */
    public function getSelectedRecordsProcessingFailureMessages(): array
    {
        return array_reduce(
            $this->selectedRecordsProcessingFailureMessages,
            function (array $carry, array $failure): array {
                if (blank($failure['message'])) {
                    return $carry;
                }

                $carry[] = $this->evaluate($failure['message'], [
                    'count' => $failure['count'],
                    'isAll' => $failure['count'] === $this->totalSelectedRecordsCount,
                    'total' => $this->totalSelectedRecordsCount,
                ]);

                return $carry;
            },
            initial: [],
        );
    }
}
