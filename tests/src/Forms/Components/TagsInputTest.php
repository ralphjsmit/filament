<?php

use Filament\Forms\Components\TagsInput;
use Filament\Forms\Form;
use Filament\Tests\Forms\Fixtures\Livewire;
use Filament\Tests\TestCase;
use Illuminate\Contracts\View\View;

use function Filament\Tests\livewire;

uses(TestCase::class);

it('can trim whitespace from TagsInput array values', function (mixed $input, mixed $expected) {
    livewire(TestComponentWithTagsInputTrim::class)
        ->fillForm(['tags' => $input])
        ->call('save')
        ->assertSet('data.tags', $expected);
})->with([
    [['  tag1  ', '  tag2  ', 'tag3'], ['tag1', 'tag2', 'tag3']],
    [['tag1', 'tag2', 'tag3'], ['tag1', 'tag2', 'tag3']],
    [null, null],
    [[], []],
    [['  tag1  ', 123, '  tag2  '], ['tag1', 123, 'tag2']],
]);


it('can strip characters from TagsInput array values', function (mixed $input, mixed $expected) {
    livewire(TestComponentWithTagsInputStripCharacters::class)
        ->fillForm(['tags' => $input])
        ->call('save')
        ->assertSet('data.tags', $expected);
})->with([
    [['tag,1', 'tag.2', 'tag3'], ['tag1', 'tag2', 'tag3']],
    [['tag1', 'tag2', 'tag3'], ['tag1', 'tag2', 'tag3']],
    [null, null],
    [[], []],
]);


class TestComponentWithTagsInputTrim extends Livewire
{
    public $data = [];

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                TagsInput::make('tags')
                    ->trim(),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $this->data = $this->form->getState();
    }

    public function render(): View
    {
        return view('forms.fixtures.form');
    }
}

class TestComponentWithTagsInputStripCharacters extends Livewire
{
    public $data = [];

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                TagsInput::make('tags')
                    ->stripCharacters([',', '.']),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $this->data = $this->form->getState();
    }

    public function render(): View
    {
        return view('forms.fixtures.form');
    }
}

