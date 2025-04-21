<?php

namespace Livewire\Features\SupportTesting {

    use Closure;

    class Testable {

        public function assertSchemaComponentExists(string $component, ?string $schema = null, ?Closure $checkComponentUsing = null): static {}

        public function assertSchemaExists(string $name): static {}

        public function assertSchemaSet(array | Closure $state, ?string $schema = null): static {}

        public function assertSchemaComponentStateSet(string $component, mixed $state, ?string $schema = null): static {}

        public function assertSchemaComponentStateNotSet(string $component, mixed $state, ?string $schema = null): static {}

        public function goToWizardStep(int $step, string $schema = 'form'): static {}

        public function goToNextWizardStep(string $schema = 'form'): static {}

        public function goToPreviousWizardStep(string $schema = 'form'): static {}

        public function assertWizardStepExists(int $step, string $schema = 'form'): static {}

        public function assertWizardCurrentStep(int $step, string $schema = 'form'): static {}
    }

}
