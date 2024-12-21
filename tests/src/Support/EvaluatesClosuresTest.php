<?php

use Filament\Support;
use Filament\Tests\TestCase;
use Illuminate\Contracts\Container\BindingResolutionException;
use Illuminate\Database\Eloquent\Model;

uses(TestCase::class);

it('will make any object from container', function () {
    $isEvaluatingClosures = new IsEvaluatingClosures;

    $isEvaluatingClosures->evaluate(function (IsEvaluatingClosures $isEvaluatingClosures) {
        $this->expectNotToPerformAssertions();
    });
});

it('will instantiate Eloquent Models provided by name', function () {
    $isEvaluatingClosures = new IsEvaluatingClosures(
        record: $recordModel = new RecordModel,
        shouldResolveDefaultClosureDependencyForEvaluationByName: true,
        shouldResolveDefaultClosureDependencyForEvaluationByType: false,
    );

    $isEvaluatingClosures->evaluate(function (RecordModel $record) {
        $this->expectNotToPerformAssertions();
    });
});

it('will not instantiate Eloquent Models not provided by name', function () {
    $isEvaluatingClosures = new IsEvaluatingClosures(
        record: $recordModel = new RecordModel,
        shouldResolveDefaultClosureDependencyForEvaluationByName: true,
        shouldResolveDefaultClosureDependencyForEvaluationByType: false,
    );

    $this->expectException(BindingResolutionException::class);

    $isEvaluatingClosures->evaluate(function (RecordModel $recordModel) {
        throw new RuntimeException('Should not be called because named parameter not provided.');
    });
});

it('will instantiate Eloquent Models provided by type', function () {
    $isEvaluatingClosures = new IsEvaluatingClosures(
        record: $recordModel = new RecordModel,
        shouldResolveDefaultClosureDependencyForEvaluationByName: false,
        shouldResolveDefaultClosureDependencyForEvaluationByType: true,
    );

    $isEvaluatingClosures->evaluate(function (RecordModel $record) use ($recordModel) {
        expect($record)->toBe($recordModel);
    });

    $isEvaluatingClosures->evaluate(function (RecordModel $recordModelWithDifferentName) use ($recordModel) {
        expect($recordModelWithDifferentName)->toBe($recordModel);
    });
});

it('will not instantiate empty Models from container', function () {
    $isEvaluatingClosures = new IsEvaluatingClosures;

    $this->expectException(BindingResolutionException::class);

    $isEvaluatingClosures->evaluate(function (RecordModel $recordModel) {
        throw new RuntimeException('Should not be called.');
    });
});

class RecordModel extends Model
{
    //
}

class IsEvaluatingClosures
{
    use Support\Concerns\EvaluatesClosures;

    public function __construct(
        public ?RecordModel $record = null,
        public bool $shouldResolveDefaultClosureDependencyForEvaluationByName = false,
        public bool $shouldResolveDefaultClosureDependencyForEvaluationByType = false,
    ) {}

    protected function resolveDefaultClosureDependencyForEvaluationByName(string $parameterName): array
    {
        return match (true) {
            $this->shouldResolveDefaultClosureDependencyForEvaluationByName && $parameterName === 'record' => [$this->record],
            default => [],
        };
    }

    protected function resolveDefaultClosureDependencyForEvaluationByType(string $parameterType): array
    {
        return match (true) {
            $this->shouldResolveDefaultClosureDependencyForEvaluationByType && $parameterType === $this->record::class => [$this->record],
            default => [],
        };
    }
}
