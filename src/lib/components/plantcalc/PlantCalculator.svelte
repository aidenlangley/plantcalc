<script lang="ts">
	import { PlantCalculator } from './plant-calculator.svelte.ts';
	import PlantCalculatorList from './PlantCalculatorList.svelte';

	const calc = new PlantCalculator();
	console.log(calc.getItems());
</script>

<section class="calculator">
	<header class="controls">
		<div class="field">
			<label for="total-area">Total area (m²)</label>
			<input id="total-area" type="number" min="0" step="0.01" bind:value={calc.totalArea} />
		</div>
		<div class="field">
			<label for="packing">Packing</label>
			<select id="packing" bind:value={calc.packing}>
				<option value="square">Square grid</option>
				<option value="triangle">Triangle (hex) packing</option>
			</select>
		</div>
		<div class="actions">
			<button type="button" onclick={calc.newItem}>Add row</button>
			<button type="button" onclick={calc.downloadCsv}>Download CSV</button>
		</div>
	</header>

	<PlantCalculatorList items={calc.getItems()} totalArea={calc.totalArea} packing={calc.packing} />

	<footer class="summary">
		<div>Total proportion: {calc.totalProportion.toFixed(1)}%</div>
		{#if calc.proportionError}
			<div class="error">{calc.proportionError}</div>
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
