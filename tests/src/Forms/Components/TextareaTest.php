<?php

use Filament\Forms\Components\Textarea;
use Filament\Forms\Form;
use Filament\Tests\Forms\Fixtures\Livewire;
use Filament\Tests\TestCase;
use Illuminate\Contracts\View\View;

use function Filament\Tests\livewire;

uses(TestCase::class);

it('can trim whitespace from Textarea', function ($input, $expected) {
    livewire(TestComponentWithTextareaTrim::class)
        ->fillForm(['description' => $input])
        ->call('save')
        ->assertSet('data.description', $expected);
})->with([
    'string with spaces' => ["  multiline\ntext content  ", "multiline\ntext content"],
    'regular string' => ['test content', 'test content'],
    'null' => [null, null],
    'empty string' => ['', ''],
    'integer' => [123, 123],
]);

class TestComponentWithTextareaTrim extends Livewire
{
    public $data = [];

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Textarea::make('description')
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