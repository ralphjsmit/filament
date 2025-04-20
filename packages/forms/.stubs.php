<?php

namespace Livewire\Features\SupportTesting {

    use Closure;

    class Testable {
        public function fillForm(array | Closure $state = [], string $schema = 'form'): static {}

        public function assertFormSet(array | Closure $state, string $schema = 'form'): static {}

        public function assertHasFormErrors(array $keys = [], string $schema = 'form'): static {}

        public function assertHasNoFormErrors(array $keys = [], string $schema = 'form'): static {}

        public function assertFormExists(string | array $name = 'form'): static {}

        public function assertFormFieldExists(string $fieldName, string | Closure $schema = 'form', ?Closure $checkFieldUsing = null): static {}

        public function assertFormFieldDoesNotExist(string $fieldName, string $schema = 'form'): static {}

        public function assertFormFieldDisabled(string $fieldName, string $schema = 'form'): static {}

        public function assertFormFieldEnabled(string $fieldName, string $schema = 'form'): static {}

        public function assertFormFieldHidden(string $fieldName, string $schema = 'form'): static {}

        public function assertFormFieldVisible(string $fieldName, string $schema = 'form'): static {}

        public function assertFormFieldReadOnly(string $fieldName, string $schema = 'form'): static {}

        public function assertFormComponentExists(string $componentKey, string | Closure $schema = 'form', ?Closure $checkComponentUsing = null): static {}

        public function assertFormComponentDoesNotExist(string $componentKey, string $schema = 'form'): static {}

        public function goToWizardStep(int $step, string $schema = 'form'): static {}

        public function goToNextWizardStep(string $schema = 'form'): static {}

        public function goToPreviousWizardStep(string $schema = 'form'): static {}

        public function assertWizardStepExists(int $step, string $schema = 'form'): static {}

        public function assertWizardCurrentStep(int $step, string $schema = 'form'): static {}
    }

}
