<?php

use Filament\Forms\Components\TagsInput;
use Filament\Forms\Form;
use Filament\Tests\Forms\Fixtures\Livewire;
use Filament\Tests\TestCase;
use Illuminate\Contracts\View\View;

use function Filament\Tests\livewire;

uses(TestCase::class);

it('can trim whitespace from TagsInput array values', function ($input, $expected) {
    livewire(TestComponentWithTagsInputTrim::class)
        ->fillForm(['tags' => $input])
        ->call('save')
        ->assertSet('data.tags', $expected);
})->with([
    'array with spaces' => [['  tag1  ', '  tag2  ', 'tag3'], ['tag1', 'tag2', 'tag3']],
    'regular array' => [['tag1', 'tag2', 'tag3'], ['tag1', 'tag2', 'tag3']],
    'null' => [null, null],
    'empty array' => [[], []],
    'mixed types' => [['  tag1  ', 123, '  tag2  '], ['tag1', 123, 'tag2']],
]);


it('can strip characters from TagsInput array values', function ($input, $expected) {
    livewire(TestComponentWithTagsInputStripCharacters::class)
        ->fillForm(['tags' => $input])
        ->call('save')
        ->assertSet('data.tags', $expected);
})->with([
    'array with characters to strip' => [['tag,1', 'tag.2', 'tag3'], ['tag1', 'tag2', 'tag3']],
    'regular array' => [['tag1', 'tag2', 'tag3'], ['tag1', 'tag2', 'tag3']],
    'null' => [null, null],
    'empty array' => [[], []],
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

