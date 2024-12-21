<?php

namespace Filament\Actions\Concerns;

use Closure;
use Filament\Support\Authorization\Denial;

trait CanCustomizeProcess
{
    protected ?Closure $using = null;

    public function using(?Closure $using): static
    {
        $this->using = $using;

        return $this;
    }

    /**
     * @param  array<string, mixed>  $parameters
     */
    public function process(?Closure $default, array $parameters = []): mixed
    {
        return $this->evaluate($this->using ?? $default, $parameters);
    }

    /**
     * @param  array<string, mixed>  $parameters
     */
    public function processIndividualRecords(?Closure $default, array $parameters = []): void
    {
        $shouldAuthorizeIndividualRecords = $this->shouldAuthorizeIndividualRecords();

        $records = $this->getSelectedRecords();
        $totalCount = $records->count();

        $successCount = 0;

        $authorizationResponses = [];
        $failureCountsByAuthorizationResponse = [];
        $failureCountWithoutAuthorizationResponse = 0;

        foreach ($records as $record) {
            if ($shouldAuthorizeIndividualRecords) {
                $response = $this->getIndividualRecordAuthorizationResponse($record);

                if ($response->denied()) {
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

                    continue;
                }
            }

            $this->process($default, [
                ...$parameters,
                'record' => $record,
            ]);

            $successCount++;
        }

        if ($totalCount <= $successCount) {
            $this->success();

            return;
        }

        $failureMessages = [];

        foreach ($authorizationResponses as $responseKey => $response) {
            if ($response instanceof Denial) {
                $failureMessages[] = $response->message($failureCountsByAuthorizationResponse[$responseKey], $totalCount);
            } else {
                $failureMessages[] = $response;
            }
        }

        $this->failure($successCount, $totalCount, $failureCountWithoutAuthorizationResponse, $failureMessages);
    }
}
