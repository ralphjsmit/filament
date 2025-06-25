---
title: Rendering a widget in a Blade view
---
import Aside from "@components/Aside.astro"

<Aside variant="warning">
    Before proceeding, make sure `filament/widgets` is installed in your project. You can check by running:

    ```bash
    composer show filament/widgets
    ```
    If it's not installed, consult the [installation guide](../introduction/installation#installing-the-individual-components) and configure the **individual components** according to the instructions.
</Aside>

## Introduction

Since widgets are Livewire components, you can easily render a widget in any Blade view using the `@livewire` directive:

```blade
<div>
    @livewire(\App\Livewire\Dashboard\PostsChart::class)
</div>
```
