<script lang="ts">
  import { setContext } from 'svelte';
  import { PlantCalculator, headers } from './plantcalc.svelte.ts';
  import PlantCalculatorList from './PlantCalculatorList.svelte';
  import InputField from '../InputField.svelte';
  import SelectField from '../SelectField.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Download, Plus } from '@lucide/svelte';

  const calc = new PlantCalculator();
  setContext('PlantCalculatorContext', calc);

  function downloadCsv() {
    const rows = calc.getItems().map((item) => {
      const { allocatedArea, plants } = calc.getItemStats(item);
      return [
        item.desc,
        Number(item.proportion) / 100 || 0,
        Number(item.spacing) || 0,
        allocatedArea.toFixed(2),
        plants
      ];
    });

    const lines = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `plant-calculator_${+new Date()}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }
</script>

<section class="calculator">
  <header class="controls">
    <InputField
      id="total-area"
      label="Total area m²"
      type="number"
      bind:value={calc.totalArea}
      placeholder="5000"
      min="0"
      step="1"
    />
    <SelectField
      id="packing"
      label="Packing"
      bind:value={calc.packing}
      selectItems={[
        { value: 'square', label: 'Square grid' },
        { value: 'triangle', label: 'Triangle (hex) packing' }
      ]}
      placeholder="Choose packing method"
    />
  </header>

  <PlantCalculatorList />

  <footer class="summary grid grid-cols-2">
    <div>Total proportion: {calc.totalProportion.toFixed(2)}%</div>
    {#if calc.proportionError}
      <div class="error">{calc.proportionError}</div>
    {/if}
    <div class="actions">
      <Button size="icon" aria-label="New row" onclick={() => calc.newItem()}>
        <Plus />
      </Button>
      <Button
        size="icon"
        aria-label="Download CSV"
        onclick={() => downloadCsv()}
      >
        <Download />
      </Button>
    </div>
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
