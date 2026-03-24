<script lang="ts">
  import { getContext, onDestroy, onMount } from 'svelte';
  import type { PlantCalculator } from './plantcalc.svelte';
  import InputField from '../InputField.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Trash } from '@lucide/svelte';

  interface PlantCalculatorLineItemProps {
    id: number;
    index: number;
    description?: string;
    proportion?: number;
    spacing?: number;
    allocatedArea: number;
    plants: number;
  }

  let {
    id = $bindable(),
    index,
    description = $bindable(''),
    proportion = $bindable(0),
    spacing = $bindable(0),
    allocatedArea,
    plants
  }: PlantCalculatorLineItemProps = $props();

  const calc: PlantCalculator = getContext('PlantCalculatorContext');

  onDestroy(() => {
    console.debug('PlantCalculatorLineItem is being destroyed');
  });

  onMount(() => {
    console.debug('PlantCaculatorLineItem has mounted');
  });
</script>

<InputField
  id={'description' + id}
  type="text"
  bind:value={description}
  placeholder="Leptospermum scoparium (Mānuka) 0.5L"
  autocomplete="off"
/>
<InputField
  id={'proportion' + id}
  type="number"
  bind:value={proportion}
  min="0"
  max="100"
  step="0.1"
/>
<InputField
  id={'spacing' + id}
  type="number"
  bind:value={spacing}
  min="0"
  step="0.01"
/>
<InputField
  id={'allocatedArea' + id}
  type="number"
  value={allocatedArea}
  placeholder="0"
  min="0"
  step="0.1"
  readonly
/>
<InputField
  id={'plants' + id}
  type="number"
  value={plants}
  placeholder="0"
  min="0"
  step="1"
  readonly
/>
<Button
  variant="destructive"
  size="icon"
  aria-label="Delete row"
  onclick={() => calc.deleteItem(index)}
>
  <Trash />
</Button>
