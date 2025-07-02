<x-dynamic-component
		:component="$getFieldWrapperView()"
		:field="$field"
>
	<div
			x-data="{ state: $wire.$entangle(@js($getStatePath())) }"
			{{ $getExtraAttributeBag() }}
	>
		{{ $getChildComponentContainer() }}
		{{-- Interact with the `state` property in Alpine.js --}}
	</div>
</x-dynamic-component>
