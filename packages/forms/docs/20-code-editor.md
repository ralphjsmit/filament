---
title: Code editor
---
import AutoScreenshot from "@components/AutoScreenshot.astro"

## Introduction

The code editor component allows you to write code in a set of common programming languages: HTML, CSS, JavaScript, PHP and JSON.

```php
use Filament\Forms\Components\CodeEditor;

CodeEditor::make('code')
```

<AutoScreenshot name="forms/fields/code-editor/simple" alt="Code editor" version="4.x" />

## Changing the code editor's language

You may change the language of the code editor using the `language()` method. The editor supports CSS, HTML, JavaScript, JSON, PHP and plain text. You can open the `Filament\Forms\Components\CodeEditor\Enums\Language` enum class to see the full list. To switch to using JavaScript as the language, you can use the `Language::JavaScript` enum value:

```php
use Filament\Forms\Components\CodeEditor;
use Filament\Forms\Components\CodeEditor\Enums\Language;

CodeEditor::make('code')
    ->language(Language::JavaScript)
```

<UtilityInjection set="formFields" version="4.x">As well as allowing a static value, the language() method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.</UtilityInjection>
