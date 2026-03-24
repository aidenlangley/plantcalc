<script lang="ts">
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	interface InputFieldProps {
		id: string;
		label?: string;
		type: string;
		value: string | number;
		[key: string]: unknown;
	}

	let {
		id,
		label = '',
		type = <'text' | 'number'>'text',
		value = $bindable(''),
		...restProps
	}: InputFieldProps = $props();
</script>

<Field.Field>
	{#if label}
		<Field.Label for={id}>{label}</Field.Label>
	{/if}
	<Input {id} {type} bind:value {...restProps} />
</Field.Field>
