<script lang="ts">
  import { getContext } from 'svelte';
  import type {
    PlantCalculator,
    PlantCalculatorItem
  } from './plantcalc.svelte.ts';
  import { headers } from './plantcalc.svelte.ts';
  import PlantCalculatorListItem from './PlantCalculatorListItem.svelte';
  import * as Item from '$lib/components/ui/item/index.js';

  const calc: PlantCalculator = getContext('PlantCalculatorContext');

  function getAllocatedArea(item: PlantCalculatorItem) {
    const proportion = Number(item.proportion) || 0;
    return calc.safeTotalArea * (proportion / 100);
  }

  function getPlantCount(item: PlantCalculatorItem) {
    const allocatedArea = getAllocatedArea(item);
    const spacing = Number(item.spacing) || 0;
    if (allocatedArea <= 0 || spacing <= 0) return 0;
    return Math.floor(allocatedArea / (spacing * calc.packingFactor));
  }
</script>

<div class="header">
  {#each headers as header (header)}
    <Item.Root variant="outline">
      <Item.Content>
        <Item.Title>{header}</Item.Title>
      </Item.Content>
    </Item.Root>
  {/each}
</div>
<ol class="list">
  {#each calc.getItems() as item, index (item.id)}
    {@const allocatedArea = getAllocatedArea(item)}
    {@const plants = getPlantCount(item)}
    <li class="list-items">
      <PlantCalculatorListItem
        bind:id={item.id}
        {index}
        bind:description={item.desc}
        bind:proportion={item.proportion}
        bind:spacing={item.spacing}
        {allocatedArea}
        {plants}
      />
    </li>
  {/each}
</ol>
{#if calc.getItems().length === 0}
  <div class="empty">No plants yet. Add a row to get started.</div>
{/if}

<style>
  .header,
  .list,
  .list-items {
    display: grid;
    grid-template-columns: 3.5fr repeat(4, minmax(0, 1fr)) 0.3fr;
    gap: 1rem;
  }

  .list-items {
    grid-column: span 6;
  }
</style>
