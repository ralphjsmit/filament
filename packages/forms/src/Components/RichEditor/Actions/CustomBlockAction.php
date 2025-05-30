<?php

namespace Filament\Forms\Components\RichEditor\Actions;

use Filament\Actions\Action;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\RichEditor\EditorCommand;
use Filament\Schemas\Schema;

class CustomBlockAction
{
    public static function make(): Action
    {
        return Action::make('customBlock')
            ->fillForm(fn (array $arguments): array => $arguments['config'] ?? [])
            ->schema(function (array $arguments, RichEditor $component, Schema $schema): Schema {
                $block = $component->getCustomBlock($arguments['id']);

                if (blank($block)) {
                    return $schema;
                }

                return $block::form($schema);
            })
            ->action(function (array $arguments, array $data, RichEditor $component): void {
                $block = $component->getCustomBlock($arguments['id']);

                if (blank($block)) {
                    return;
                }

                $customBlockContent = [
                    'type' => 'customBlock',
                    'attrs' => [
                        'config' => $data,
                        'id' => $arguments['id'],
                        'label' => $block::getLabel(),
                        'preview' => base64_encode($block::toPreviewHtml($data)),
                    ],
                ];

                // Insert at the dragged position
                if (filled($arguments['dragPosition'] ?? null)) {
                    $component->runCommands(
                        [
                            EditorCommand::make(
                                'insertContentAt',
                                arguments: [
                                    $arguments['dragPosition'],
                                    $customBlockContent,
                                ],
                            ),
                        ],
                    );

                    return;
                }

                // Insert after the currently selected node
                if (
                    ($arguments['editorSelection']['type'] === 'node') &&
                    (($arguments['mode'] ?? null) === 'insert')
                ) {
                    $component->runCommands(
                        [
                            EditorCommand::make(
                                'insertContentAt',
                                arguments: [
                                    ($arguments['editorSelection']['anchor'] ?? -1) + 1,
                                    $customBlockContent,
                                ],
                            ),
                        ],
                    );

                    return;
                }

                // Insert at the current selection
                $component->runCommands(
                    [
                        EditorCommand::make(
                            'insertContent',
                            arguments: [
                                $customBlockContent,
                            ],
                        ),
                    ],
                    editorSelection: $arguments['editorSelection'],
                );
            });
    }
}
