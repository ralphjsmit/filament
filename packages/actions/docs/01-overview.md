---
title: Overview
---
import AutoScreenshot from "@components/AutoScreenshot.astro"

## Introduction

"Action" is a word that is used quite a bit within the Laravel community. Traditionally, action PHP classes handle "doing" something in your application's business logic. For instance, logging a user in, sending an email, or creating a new user record in the database.

In Filament, actions also handle "doing" something in your app. However, they are a bit different from traditional actions. They are designed to be used in the context of a user interface. For instance, you might have a button to delete a client record, which opens a modal to confirm your decision. When the user clicks the "Delete" button in the modal, the client is deleted. This whole workflow is an "action".

```php
use Filament\Actions\Action;

Action::make('delete')
    ->requiresConfirmation()
    ->action(fn () => $this->client->delete())
```

Actions can also collect extra information from the user. For instance, you might have a button to email a client. When the user clicks the button, a modal opens to collect the email subject and body. When the user clicks the "Send" button in the modal, the email is sent:

```php
use Filament\Actions\Action;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TextInput;
use Illuminate\Support\Facades\Mail;

Action::make('sendEmail')
    ->form([
        TextInput::make('subject')->required(),
        RichEditor::make('body')->required(),
    ])
    ->action(function (array $data) {
        Mail::to($this->client)
            ->send(new GenericEmail(
                subject: $data['subject'],
                body: $data['body'],
            ));
    })
```

Usually, actions get executed without redirecting the user away from the page. This is because we extensively use Livewire. However, actions can be much simpler, and don't even need a modal. You can pass a URL to an action, and when the user clicks on the button, they are redirected to that page:

```php
use Filament\Actions\Action;

Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
```

The entire look of the action's trigger button and the modal is customizable using fluent PHP methods. We provide a sensible and consistent styling for the UI, but all of this is customizable with CSS.

## Available actions

Filament includes several actions that you can add to your app. Their aim is to simplify the most common Eloquent-related actions:

- [Create](create)
- [Edit](edit)
- [View](view)
- [Delete](delete)
- [Replicate](replicate)
- [Force-delete](force-delete)
- [Restore](restore)
- [Import](import)
- [Export](export)

## Choosing a trigger style

Out of the box, action triggers have 4 styles - "button", "link", "icon button", and "badge".

"Button" triggers have a background color, label, and optionally an [icon](#setting-an-icon). Usually, this is the default button style, but you can use it manually with the `button()` method:

```php
use Filament\Actions\Action;

Action::make('edit')
    ->button()
```

<AutoScreenshot name="actions/trigger-button/button" alt="Button trigger" version="4.x" />

"Link" triggers have no background color. They must have a label and optionally an [icon](#setting-an-icon). They look like a link that you might find embedded within text. You can switch to that style with the `link()` method:

```php
use Filament\Actions\Action;

Action::make('edit')
    ->link()
```

<AutoScreenshot name="actions/trigger-button/link" alt="Link trigger" version="4.x" />

"Icon button" triggers are circular buttons with an [icon](#setting-an-icon) and no label. You can switch to that style with the `iconButton()` method:

```php
use Filament\Actions\Action;

Action::make('edit')
    ->icon('heroicon-m-pencil-square')
    ->iconButton()
```

<AutoScreenshot name="actions/trigger-button/icon-button" alt="Icon button trigger" version="4.x" />

"Badge" triggers have a background color, label, and optionally an [icon](#setting-an-icon). You can use a badge as trigger using the `badge()` method:

```php
use Filament\Actions\Action;

Action::make('edit')
    ->badge()
```

<AutoScreenshot name="actions/trigger-button/badge" alt="Badge trigger" version="4.x" />

### Using an icon button on mobile devices only

You may want to use a button style with a label on desktop, but remove the label on mobile. This will transform it into an icon button. You can do this with the `labeledFrom()` method, passing in the responsive [breakpoint](https://tailwindcss.com/docs/responsive-design#overview) at which you want the label to be added to the button:

```php
use Filament\Actions\Action;

Action::make('edit')
    ->icon('heroicon-m-pencil-square')
    ->button()
    ->labeledFrom('md')
```

## Setting a label

By default, the label of the trigger button is generated from its name. You may customize this using the `label()` method:

```php
use Filament\Actions\Action;

Action::make('edit')
    ->label('Edit post')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
```

## Setting a color

Buttons may have a [color](../styling/colors) to indicate their significance:

```php
use Filament\Actions\Action;

Action::make('delete')
    ->color('danger')
```

<AutoScreenshot name="actions/trigger-button/danger" alt="Red trigger" version="4.x" />

## Setting a size

Buttons come in 3 sizes - `Size::Small`, `Size::Medium` or `Size::Large`. You can change the size of the action's trigger using the `size()` method:

```php
use Filament\Actions\Action;
use Filament\Support\Enums\Size;

Action::make('create')
    ->size(Size::Large)
```

<AutoScreenshot name="actions/trigger-button/large" alt="Large trigger" version="4.x" />

## Setting an icon

Buttons may have an [icon](../styling/icons) to add more detail to the UI. You can set the icon using the `icon()` method:

```php
use Filament\Actions\Action;

Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
    ->icon('heroicon-m-pencil-square')
```

<AutoScreenshot name="actions/trigger-button/icon" alt="Trigger with icon" version="4.x" />

You can also change the icon's position to be after the label instead of before it, using the `iconPosition()` method:

```php
use Filament\Actions\Action;
use Filament\Support\Enums\IconPosition;

Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
    ->icon('heroicon-m-pencil-square')
    ->iconPosition(IconPosition::After)
```

<AutoScreenshot name="actions/trigger-button/icon-after" alt="Trigger with icon after the label" version="4.x" />

## Authorization

You may conditionally show or hide actions for certain users. To do this, you can use either the `visible()` or `hidden()` methods:

```php
use Filament\Actions\Action;

Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
    ->visible(auth()->user()->can('update', $this->post))

Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
    ->hidden(! auth()->user()->can('update', $this->post))
```

This is useful for authorization of certain actions to only users who have permission.

### Disabling a button

If you want to disable a button instead of hiding it, you can use the `disabled()` method:

```php
use Filament\Actions\Action;

Action::make('delete')
    ->disabled()
```

You can conditionally disable a button by passing a boolean to it:

```php
use Filament\Actions\Action;

Action::make('delete')
    ->disabled(! auth()->user()->can('delete', $this->post))
```

## Registering keybindings

You can attach keyboard shortcuts to trigger buttons. These use the same key codes as [Mousetrap](https://craig.is/killing/mice):

```php
use Filament\Actions\Action;

Action::make('save')
    ->action(fn () => $this->save())
    ->keyBindings(['command+s', 'ctrl+s'])
```

## Adding a badge to the corner of the button

You can add a badge to the corner of the button, to display whatever you want. It's useful for displaying a count of something, or a status indicator:

```php
use Filament\Actions\Action;

Action::make('filter')
    ->iconButton()
    ->icon('heroicon-m-funnel')
    ->badge(5)
```

<AutoScreenshot name="actions/trigger-button/badged" alt="Trigger with badge" version="4.x" />

You can also pass a [color](../styling/colors) to be used for the badge:

```php
use Filament\Actions\Action;

Action::make('filter')
    ->iconButton()
    ->icon('heroicon-m-funnel')
    ->badge(5)
    ->badgeColor('success')
```

<AutoScreenshot name="actions/trigger-button/success-badged" alt="Trigger with green badge" version="4.x" />

## Outlined button style

When you're using the "button" trigger style, you might wish to make it less prominent. You could use a different [color](#setting-a-color), but sometimes you might want to make it outlined instead. You can do this with the `outlined()` method:

```php
use Filament\Actions\Action;

Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
    ->button()
    ->outlined()
```

<AutoScreenshot name="actions/trigger-button/outlined" alt="Outlined trigger button" version="4.x" />

## Adding extra HTML attributes

You can pass extra HTML attributes to the button which will be merged onto the outer DOM element. Pass an array of attributes to the `extraAttributes()` method, where the key is the attribute name and the value is the attribute value:

```php
use Filament\Actions\Action;

Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
    ->extraAttributes([
        'title' => 'Edit this post',
    ])
```

If you pass CSS classes in a string, they will be merged with the default classes that already apply to the other HTML element of the button:

```php
use Filament\Actions\Action;

Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
    ->extraAttributes([
        'class' => 'mx-auto my-8',
    ])
```

## Rate limiting actions

You can rate limit actions by using the `rateLimit()` method. This method accepts the number of attempts per minute that a user IP address can make. If the user exceeds this limit, the action will not run and a notification will be shown:

```php
use Filament\Actions\Action;

Action::make('delete')
    ->rateLimit(5)
```

If the action opens a modal, the rate limit will be applied when the modal is submitted.

If an action is opened with arguments or for a specific Eloquent record, the rate limit will apply to each unique combination of arguments or record for each action. The rate limit is also unique to the current Livewire component / page in a panel.

## Customizing the rate limited notification

When an action is rate limited, a notification is dispatched to the user, which indicates the rate limit.

To customize the title of this notification, use the `rateLimitedNotificationTitle()` method:

```php
use Filament\Actions\DeleteAction;

DeleteAction::make()
    ->rateLimit(5)
    ->rateLimitedNotificationTitle('Slow down!')
```

You may customize the entire notification using the `rateLimitedNotification()` method:

```php
use DanHarrin\LivewireRateLimiting\Exceptions\TooManyRequestsException;
use Filament\Actions\DeleteAction;
use Filament\Notifications\Notification;

DeleteAction::make()
    ->rateLimit(5)
    ->rateLimitedNotification(
       fn (TooManyRequestsException $exception): Notification => Notification::make()
            ->warning()
            ->title('Slow down!')
            ->body("You can try deleting again in {$exception->secondsUntilAvailable} seconds."),
    )
```

### Customizing the rate limit behavior

If you wish to customize the rate limit behavior, you can use Laravel's [rate limiting](https://laravel.com/docs/rate-limiting#basic-usage) features and Filament's [flash notifications](../notifications/overview) together in the action.

If you want to rate limit immediately when an action modal is opened, you can do so in the `mountUsing()` method:

```php
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\RateLimiter;

Action::make('delete')
    ->mountUsing(function () {
        if (RateLimiter::tooManyAttempts(
            $rateLimitKey = 'delete:' . auth()->id(),
            maxAttempts: 5,
        )) {
            Notification::make()
                ->title('Too many attempts')
                ->body('Please try again in ' . RateLimiter::availableIn($rateLimitKey) . ' seconds.')
                ->danger()
                ->send();
                
            return;
        }
        
         RateLimiter::hit($rateLimitKey);
    })
```

If you want to rate limit when an action is run, you can do so in the `action()` method:

```php
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\RateLimiter;

Action::make('delete')
    ->action(function () {
        if (RateLimiter::tooManyAttempts(
            $rateLimitKey = 'delete:' . auth()->id(),
            maxAttempts: 5,
        )) {
            Notification::make()
                ->title('Too many attempts')
                ->body('Please try again in ' . RateLimiter::availableIn($rateLimitKey) . ' seconds.')
                ->danger()
                ->send();
                
            return;
        }
        
         RateLimiter::hit($rateLimitKey);
        
        // ...
    })
```

## Action utility injection

The vast majority of methods used to configure actions accept functions as parameters instead of hardcoded values:

```php
use Filament\Actions\Action;

Action::make('edit')
    ->label('Edit post')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
```

This alone unlocks many customization possibilities.

The package is also able to inject many utilities to use inside these functions, as parameters. All customization methods that accept functions as arguments can inject utilities.

These injected utilities require specific parameter names to be used. Otherwise, Filament doesn't know what to inject.

### Injecting the current modal form data

If you wish to access the current [modal form data](modals#modal-forms), define a `$data` parameter:

```php
function (array $data) {
    // ...
}
```

Be aware that this will be empty if the modal has not been submitted yet.

### Injecting the current arguments

If you wish to access the [current arguments](adding-an-action-to-a-livewire-component#passing-action-arguments) that have been passed to the action, define an `$arguments` parameter:

```php
function (array $arguments) {
    // ...
}
```

### Injecting the current Livewire component instance

If you wish to access the current Livewire component instance that the action belongs to, define a `$livewire` parameter:

```php
use Livewire\Component;

function (Component $livewire) {
    // ...
}
```

### Injecting the current action instance

If you wish to access the current action instance, define a `$action` parameter:

```php
function (Action $action) {
    // ...
}
```

### Injecting multiple utilities

The parameters are injected dynamically using reflection, so you are able to combine multiple parameters in any order:

```php
use Livewire\Component;

function (array $arguments, Component $livewire) {
    // ...
}
```

### Injecting dependencies from Laravel's container

You may inject anything from Laravel's container like normal, alongside utilities:

```php
use Illuminate\Http\Request;

function (Request $request, array $arguments) {
    // ...
}
```
