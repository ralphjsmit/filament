<?php

use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Tests\Forms\Fixtures\Livewire;
use Filament\Tests\TestCase;
use Illuminate\Contracts\View\View;

use function Filament\Tests\livewire;

uses(TestCase::class);

it('can trim whitespace from TextInput', function ($input, $expected) {
    livewire(TestComponentWithTextInputTrim::class)
        ->fillForm(['name' => $input])
        ->call('save')
        ->assertSet('data.name', $expected);
})->with([
    'string with spaces' => ['  test value  ', 'test value'],
    'regular string' => ['test value', 'test value'],
    'null' => [null, null],
    'empty string' => ['', ''],
    'integer' => [123, 123],
]);

class TestComponentWithTextInputTrim extends Livewire
{
    public $data = [];

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')
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