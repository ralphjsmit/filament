<?php

namespace Livewire\Features\SupportTesting {

    use Closure;

    class Testable {

        public function assertSchemaComponentExists(string $component, ?string $schema = null, ?Closure $checkComponentUsing = null): static {}

        public function assertSchemaExists(string $name): static {}

        public function assertSchemaSet(array | Closure $state, ?string $schema = null): static {}

        public function assertSchemaComponentStateSet(string $component, mixed $state, ?string $schema = null): static {}

        public function assertSchemaComponentStateNotSet(string $component, mixed $state, ?string $schema = null): static {}
    }

}
