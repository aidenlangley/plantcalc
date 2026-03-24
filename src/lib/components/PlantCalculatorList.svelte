<script lang="ts">
	import PlantCalculatorListItem from './PlantCalculatorListItem.svelte';

	type PlantItem = {
		id: number;
		description: string;
		proportion: number;
		spacing: number;
	};

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

<div class="list">
	<div class="header row">
		<div>Description</div>
		<div class="right">Proportion (%)</div>
		<div class="right">Spacing (m²)</div>
		<div class="right">Allocated Area (m²)</div>
		<div class="right">Plants</div>
	</div>
	{#each items as item (item.id)}
		{@const allocatedArea = getAllocatedArea(item)}
		{@const plants = getPlantCount(item)}
		<PlantCalculatorListItem
			bind:description={item.description}
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
	.list {
		display: grid;
		grid-template-columns: 4fr repeat(5, minmax(0, 1fr));
		gap: 1rem;
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
