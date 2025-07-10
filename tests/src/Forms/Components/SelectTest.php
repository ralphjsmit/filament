<?php

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Filament\Tests\Fixtures\Livewire\Livewire;
use Filament\Tests\TestCase;

use function Filament\Tests\livewire;

uses(TestCase::class);

it('can trim whitespace from TextInput', function (): void {
	livewire(TestComponentWithSelect::class)
		->fillForm(['product_id' => 123])
		->call('save')
		->assertHasNoFormErrors();
});

class TestComponentWithSelect extends Livewire
{
	public $data = [];
	
	public function form(Schema $form): Schema
	{
		return $form
			->schema([
				Select::make('product_id')
					->searchable()
					->getSearchResultsUsing(function () {
						return [
							123 => 'Product A',
							234 => 'Product B',
						];
					})
					->required()
			])
			->statePath('data');
	}
	
	public function save(): void
	{
		$state = $this->form->getState();
	}
}