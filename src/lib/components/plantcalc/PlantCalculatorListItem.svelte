<script lang="ts">
	import InputField from '../InputField.svelte';

	interface PlantCalculatorLineItemProps {
		description?: string;
		proportion?: number;
		spacing?: number;
		allocatedArea: number;
		plants: number;
	}

	let {
		description = $bindable(''),
		proportion = $bindable(20),
		spacing = $bindable(1.5),
		allocatedArea,
		plants
	}: PlantCalculatorLineItemProps = $props();
</script>

<div>
	<InputField
		id="description"
		type="text"
		bind:value={description}
		placeholder="Leptospermum scoparium (Mānuka) 0.5L"
		autocomplete="off"
	/>
	<InputField
		id="proportion"
		type="number"
		bind:value={proportion}
		placeholder="20"
		min="0"
		max="100"
		step="0.1"
	/>
	<InputField
		id="spacing"
		type="number"
		bind:value={spacing}
		placeholder="1.5"
		min="0"
		step="0.01"
	/>
	<InputField
		id="allocatedArea"
		type="number"
		bind:value={allocatedArea}
		placeholder="0"
		min="0"
		step="0.1"
		readonly
	/>
	<InputField
		id="plants"
		type="number"
		bind:value={plants}
		placeholder="0"
		min="0"
		step="1"
		readonly
	/>
</div>
