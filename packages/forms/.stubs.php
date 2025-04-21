<?php

namespace Livewire\Features\SupportTesting {

    use Closure;

    class Testable {
        public function fillForm(array | Closure $state = [], string $form = 'form'): static {}

        public function assertFormSet(array | Closure $state, string $form = 'form'): static {}

        public function assertHasFormErrors(array $keys = [], string $form = 'form'): static {}

        public function assertHasNoFormErrors(array $keys = [], string $form = 'form'): static {}

        public function assertFormFieldExists(string $fieldName, string | Closure $form = 'form', ?Closure $checkFieldUsing = null): static {}

        public function assertFormFieldDoesNotExist(string $fieldName, string $form = 'form'): static {}

        public function assertFormFieldDisabled(string $fieldName, string $form = 'form'): static {}

        public function assertFormFieldEnabled(string $fieldName, string $form = 'form'): static {}

        public function assertFormFieldReadOnly(string $fieldName, string $form = 'form'): static {}

        /**
         * @deprecated Use `assertSchemaExists()` instead.
         */
        public function assertFormExists(string $name = 'form'): static {}

        /**
         * @deprecated Use `assertSchemaComponentHidden()` instead.
         */
        public function assertFormFieldHidden(string $fieldName, string $form = 'form'): static {}

        /**
         * @deprecated Use `assertSchemaComponentVisible()` instead.
         */
        public function assertFormFieldVisible(string $fieldName, string $form = 'form'): static {}

        /**
         * @deprecated Use `assertSchemaComponentExists()` instead.
         */
        public function assertFormComponentExists(string $componentKey, string | Closure $form = 'form', ?Closure $checkComponentUsing = null): static {}

        /**
         * @deprecated Use `assertSchemaComponentDoesNotExist()` instead.
         */
        public function assertFormComponentDoesNotExist(string $componentKey, string $form = 'form'): static {}
    }

}
