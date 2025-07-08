<?php

use Filament\Facades\Filament;
use Filament\Tests\Fixtures\Models\Ticket;
use Filament\Tests\TestCase;
use Illuminate\Database\Connection;
use Illuminate\Database\Query\Grammars\MySqlGrammar;
use Illuminate\Database\Query\Grammars\PostgresGrammar;
use Illuminate\View\ComponentAttributeBag;

use function Filament\get_authorization_response;
use function Filament\Support\generate_search_column_expression;
use function Filament\Support\prepare_inherited_attributes;

uses(TestCase::class);

it('will prepare attributes', function (): void {
    $bag = new ComponentAttributeBag([
        'style' => 'color:red',
    ]);

    $attributes = prepare_inherited_attributes($bag);

    expect($attributes->getAttributes())->toBe([
        'style' => 'color:red',
    ]);
});

it('will prepare Alpine attributes', function (): void {
    $bag = new ComponentAttributeBag([
        'x-data' => '{foo:bar}',
    ]);

    $attributes = prepare_inherited_attributes($bag);

    expect($attributes->getAttributes())->toBe([
        'x-data' => '{foo:bar}',
    ]);
});

it('will prepare data attributes', function (): void {
    $bag = new ComponentAttributeBag([
        'data-foo' => 'bar',
    ]);

    $attributes = prepare_inherited_attributes($bag);

    expect($attributes->getAttributes())->toBe([
        'data-foo' => 'bar',
    ]);
});

it('can handle policy being an object when method does not exist', function (): void {
    Filament::getCurrentOrDefaultPanel()->strictAuthorization();

    get_authorization_response('edit', Ticket::class);
})->throws(Exception::class, 'Strict authorization mode is enabled, but no [edit()] method was found on [Filament\Tests\Fixtures\Policies\TicketPolicy].');

it('will generate json search column expression for mysql', function (): void {
    $column = 'data->name';
    $isSearchForcedCaseInsensitive = true;

    $databaseConnection = Mockery::mock(Connection::class);
    $databaseConnection->shouldReceive('getDriverName')->andReturn('mysql');
    $databaseConnection->shouldReceive('getConfig')->with('search_collation')->andReturn(null);

    $grammar = new MySqlGrammar($databaseConnection);

    $databaseConnection->shouldReceive('getQueryGrammar')->andReturn($grammar);

    $expression = generate_search_column_expression($column, $isSearchForcedCaseInsensitive, $databaseConnection);

    expect($expression->getValue($grammar))
        ->toBe("lower(json_extract(`data`, '$.\"name\"'))");
});

it('will generate json search column expression for pgsql', function (): void {
    $column = 'data->name';
    $isSearchForcedCaseInsensitive = true;

    $databaseConnection = Mockery::mock(Connection::class);
    $databaseConnection->shouldReceive('getDriverName')->andReturn('pgsql');
    $databaseConnection->shouldReceive('getConfig')->with('search_collation')->andReturn(null);

    $grammar = new PostgresGrammar($databaseConnection);

    $expression = generate_search_column_expression($column, $isSearchForcedCaseInsensitive, $databaseConnection);

    expect($expression->getValue($grammar))
        ->toBe("lower(\"data\"->>'name'::text)");
});

it('will generate column expression for pgsql with colons in the name', function (string $column, string $text): void {
    $isSearchForcedCaseInsensitive = true;

    $databaseConnection = Mockery::mock(Connection::class);
    $databaseConnection->shouldReceive('getDriverName')->andReturn('pgsql');
    $databaseConnection->shouldReceive('getConfig')->with('search_collation')->andReturn(null);

    $grammar = new PostgresGrammar($databaseConnection);

    $expression = generate_search_column_expression($column, $isSearchForcedCaseInsensitive, $databaseConnection);

    expect($expression->getValue($grammar))
        ->toBe($text);
})
    ->with([
        ['blog:posts.title', 'lower("blog:posts"."title"::text)'],
        ['blog:posts:comments.author.name', 'lower("blog:posts:comments"."author"."name"::text)'],
    ]);
