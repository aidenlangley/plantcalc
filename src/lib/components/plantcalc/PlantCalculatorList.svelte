<script lang="ts">
	import type { PlantItem } from './plant-calculator.svelte.ts';
	import PlantCalculatorListItem from './PlantCalculatorListItem.svelte';

	interface PlantCalculatorListProps {
		totalArea: number;
		packing: 'square' | 'triangle';
		items: PlantItem[];
	}

	let { totalArea = 0, packing = 'square', items = [] }: PlantCalculatorListProps = $props();

	const packingFactor = $derived(packing === 'triangle' ? Math.sqrt(3) / 2 : 1);
	const safeTotalArea = $derived(Math.max(0, totalArea || 0));

	function getAllocatedArea(item: PlantItem) {
		const proportion = Number(item.proportion) || 0;
		return safeTotalArea * (proportion / 100);
	}

	function getPlantCount(item: PlantItem) {
		const allocatedArea = getAllocatedArea(item);
		const spacing = Number(item.spacing) || 0;
		if (allocatedArea <= 0 || spacing <= 0) return 0;
		return Math.floor(allocatedArea / (spacing * packingFactor));
	}
</script>

<div class="table">
	<div>Description</div>
	<div>Proportion (%)</div>
	<div>Spacing (m²)</div>
	<div>Area (m²)</div>
	<div>Plants</div>
	{#each items as item (item.id)}
		{@const allocatedArea = getAllocatedArea(item)}
		{@const plants = getPlantCount(item)}
		<PlantCalculatorListItem
			bind:description={item.desc}
			bind:proportion={item.proportion}
			bind:spacing={item.spacing}
			{allocatedArea}
			{plants}
		/>
	{/each}
	{#if items.length === 0}
		<div class="empty">No plants yet. Add a row to get started.</div>
	{/if}
</div>

<style>
	.table {
		display: grid;
		grid-template-columns: 4fr repeat(4, minmax(0, 1fr));
		gap: 1rem;
		align-items: center;
	}

	.row {
		display: grid;
		grid-template-columns: 1.4fr 0.7fr 0.7fr 0.7fr 0.5fr;
		gap: 0.5rem;
		align-items: center;
	}

	.header {
		font-size: 0.9rem;
		opacity: 0.7;
	}

	.right {
		text-align: right;
	}

	.empty {
		padding: 0.5rem 0;
		opacity: 0.6;
	}
</style>
