---
title: Rendering notifications outside of a panel
---

## Introduction

To render notifications in your app, make sure the `notifications` Livewire component is rendered in your layout:

```blade
<div>
    @livewire('notifications')
</div>
```

Now, when [sending a notification](../notifications) from a Livewire request, it will appear for the user.
