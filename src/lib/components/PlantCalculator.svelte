<script lang="ts">
	import PlantCalculatorList from './PlantCalculatorList.svelte';

	type PlantItem = {
		id: number;
		description: string;
		proportion: number;
		spacing: number;
	};

	let totalArea = $state(10);
	let packing = $state<'square' | 'triangle'>('square');
	let nextId = $state(1);

	const defaults = {
		proportion: 20,
		spacing: 1.5
	};
	let items = $state<PlantItem[]>([
		{
			id: nextId++,
			description: 'Leptospermum scoparium (Mānuka) 0.5L',
			proportion: defaults.proportion,
			spacing: defaults.spacing
		},
		{
			id: nextId++,
			description: 'Kunzea spp. (Kānuka) 0.5L',
			proportion: defaults.proportion,
			spacing: defaults.spacing
		},
		{
			id: nextId++,
			description: 'Coprosma robusta (Karamū) 0.5L',
			proportion: defaults.proportion,
			spacing: defaults.spacing
		},
		{
			id: nextId++,
			description: 'Pitto spp. 0.5L',
			proportion: defaults.proportion,
			spacing: defaults.spacing
		},
		{
			id: nextId++,
			description: 'Phormium tenax (Harakeke / Flax) 0.5L',
			proportion: defaults.proportion,
			spacing: defaults.spacing
		}
	]);

	const totalProportion = $derived.by(() =>
		items.reduce((sum, item) => sum + (Number(item.proportion) || 0), 0)
	);

	const proportionError = $derived(
		totalProportion < 0 || totalProportion > 100 ? 'Total proportion must stay within 0–100%.' : ''
	);

	const packingFactor = $derived(packing === 'triangle' ? Math.sqrt(3) / 2 : 1);

	function addRow() {
		items.push({ id: nextId++, description: '', proportion: 0, spacing: 0.25 });
	}

	function getItemStats(item: PlantItem) {
		const safeTotalArea = Math.max(0, Number(totalArea) || 0);
		const proportion = Number(item.proportion) || 0;
		const spacing = Number(item.spacing) || 0;
		const allocatedArea = safeTotalArea * (proportion / 100);
		const plants =
			allocatedArea > 0 && spacing > 0 ? Math.floor(allocatedArea / (spacing * packingFactor)) : 0;
		return { allocatedArea, plants };
	}

	function downloadCsv() {
		const headers = [
			'Description',
			'Proportion (%)',
			'Spacing (m2)',
			'Allocated Area (m2)',
			'Plants'
		];
		const rows = items.map((item) => {
			const { allocatedArea, plants } = getItemStats(item);
			return [
				item.description,
				Number(item.proportion) || 0,
				Number(item.spacing) || 0,
				allocatedArea.toFixed(2),
				plants
			];
		});
		const lines = [headers, ...rows]
			.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
			.join('\n');
		const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'plant-calculator.csv';
		link.click();
		URL.revokeObjectURL(url);
	}
</script>

<section class="calculator">
	<header class="controls">
		<div class="field">
			<label for="total-area">Total area (m²)</label>
			<input id="total-area" type="number" min="0" step="0.01" bind:value={totalArea} />
		</div>
		<div class="field">
			<label for="packing">Packing</label>
			<select id="packing" bind:value={packing}>
				<option value="square">Square grid</option>
				<option value="triangle">Triangle (hex) packing</option>
			</select>
		</div>
		<div class="actions">
			<button type="button" onclick={addRow}>Add row</button>
			<button type="button" onclick={downloadCsv}>Download CSV</button>
		</div>
	</header>

	<PlantCalculatorList {items} {totalArea} {packing} />

	<footer class="summary">
		<div>Total proportion: {totalProportion.toFixed(1)}%</div>
		{#if proportionError}
			<div class="error">{proportionError}</div>
		{/if}
	</footer>
</section>

<style>
	.calculator {
		display: grid;
		gap: 1rem;
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: flex-end;
	}

	.field {
		display: grid;
		gap: 0.35rem;
		min-width: 180px;
	}

	.field input,
	.field select {
		padding: 0.35rem 0.5rem;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
		margin-left: auto;
	}

	.summary {
		display: grid;
		gap: 0.25rem;
		font-size: 0.95rem;
	}

	.error {
		color: #b42318;
	}
</style>
