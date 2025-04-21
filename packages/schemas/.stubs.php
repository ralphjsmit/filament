<?php

namespace Livewire\Features\SupportTesting {

    use Closure;

    class Testable {

        public function assertSchemaComponentExists(string $component, ?string $schema = null, ?Closure $checkComponentUsing = null): static {}

        public function assertSchemaExists(string $name): static {}
    }

}
