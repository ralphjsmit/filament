@php
    $id = $getId();
    $key = $getKey();
    $wizard = $getContainer()->getParentComponent();
    $wizardKey = $wizard->getKey();
    $isContained = $wizard->isContained();
    $alpineSubmitHandler = $hasFormWrapper() ? $wizard->getAlpineSubmitHandler() : null;
@endphp

<{{ filled($alpineSubmitHandler) ? 'form' : 'div' }}
    x-bind:tabindex="$el.querySelector('[autofocus]') ? '-1' : '0'"
    x-bind:class="{
        'fi-active': step === @js($key),
    }"
    x-on:expand="
        if (! isStepAccessible(@js($key))) {
            return
        }

        step = @js($key)
    "
    @if (filled($alpineSubmitHandler))
        x-on:submit.prevent="console.log(isLastStep()); isLastStep() ? {!! $alpineSubmitHandler !!} : $wire.callSchemaComponentMethod(@js($wizardKey), 'nextStep', {
            currentStepIndex: getStepIndex(step),
        })"
    @endif
    x-ref="step-{{ $key }}"
    {{
        $attributes
            ->merge([
                'aria-labelledby' => $id,
                'id' => $id,
                'role' => 'tabpanel',
            ], escape: false)
            ->merge($getExtraAttributes(), escape: false)
            ->class(['fi-sc-wizard-step'])
    }}
>
    {{ $getChildComponentContainer() }}

    @if (filled($alpineSubmitHandler))
        {{-- This is a hack to allow the form to submit when the user presses the enter key, even if there is no other submit button in the form. --}}
        <input type="submit" hidden />
    @endif
</{{ filled($alpineSubmitHandler) ? 'form' : 'div' }}>
