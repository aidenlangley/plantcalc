import { createContext } from 'svelte';

type Packing = 'square' | 'triangle';

type PlantCalculatorItem = {
  id: number;
  desc?: string;
  proportion?: number;
  spacing?: number;
};

let id = $state(1);
const nextId = (): number => id++;

function blankItem(): PlantCalculatorItem {
  return { id: nextId(), desc: '', proportion: 0, spacing: 0 };
}

const proportion = 25;
const spacing = 1.5;

const items: PlantCalculatorItem[] = [
  {
    id: nextId(),
    desc: 'Leptospermum scoparium (Mānuka) 0.5L',
    proportion: proportion,
    spacing: spacing - 0.25
  },
  {
    id: nextId(),
    desc: 'Kunzea spp. (Kānuka) 0.5L',
    proportion: proportion,
    spacing: spacing
  },
  {
    id: nextId(),
    desc: 'Coprosma robusta (Karamū) 0.5L',
    proportion: proportion,
    spacing: spacing
  },
  {
    id: nextId(),
    desc: 'Phormium tenax (Harakeke / Flax) 0.5L',
    proportion: proportion,
    spacing: spacing + 0.5
  }
];

const headers = [
  'Description',
  'Proportion %',
  'Spacing m²',
  'Area m²',
  '# Plants'
];

class PlantCalculator {
  public packing: Packing = $state('square');
  public packingFactor = $derived(
    this.packing === 'triangle' ? Math.sqrt(3) / 2 : 1
  );

  items: PlantCalculatorItem[] = $state(items);
  public getItems = () => this.items;
  public newItem = () => this.items.push(blankItem());
  public deleteItem = (index: number) => this.items.splice(index, 1);

  public totalArea = $state(5000);
  public safeTotalArea = $derived(Math.max(0, this.totalArea || 0));

  public totalProportion = $derived.by(() =>
    this.getItems().reduce(
      (sum, item: PlantCalculatorItem) => sum + (Number(item.proportion) || 0),
      0
    )
  );
  public proportionError = $derived(
    this.totalProportion < 0 || this.totalProportion > 100
      ? 'Proportions must total 100%.'
      : ''
  );

  public getItemStats = (item: PlantCalculatorItem) => {
    const safeTotalArea = Math.max(0, Number(this.totalArea) || 0);
    const proportion = Number(item.proportion) || 0;
    const spacing = Number(item.spacing) || 0;
    const allocatedArea = safeTotalArea * (proportion / 100);
    const plants =
      allocatedArea > 0 && spacing > 0
        ? Math.floor(allocatedArea / (spacing * this.packingFactor))
        : 0;
    return { allocatedArea, plants };
  };
}

export { PlantCalculator, headers, type Packing, type PlantCalculatorItem };

export const [getPlantCalculatorContext, setPlantCalculatorContext] =
  createContext<PlantCalculator>();
