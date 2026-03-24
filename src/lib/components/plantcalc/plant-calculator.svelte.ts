type Packing = 'square' | 'triangle';

type PlantItem = {
	id: number;
	desc?: string;
	proportion?: number;
	spacing?: number;
};

let id = $state(1);
const nextId = (): number => id++;

const proportion = 33.33;
const spacing = 1.5;

function blankItem(): PlantItem {
	return { id: nextId(), desc: '', proportion, spacing };
}

const items: PlantItem[] = [
	{
		id: nextId(),
		desc: 'Leptospermum scoparium (Mānuka) 0.5L',
		proportion: proportion,
		spacing: spacing
	},
	{
		id: nextId(),
		desc: 'Kunzea spp. (Kānuka) 0.5L',
		proportion: proportion,
		spacing: spacing
	},
	blankItem()
];

const headers = ['Description', 'Proportion (%)', 'Spacing (m²)', 'Area (m²)', '# Plants'];

class PlantCalculator {
	public packing: Packing = $state('square');
	public packingFactor = $derived(this.packing === 'triangle' ? Math.sqrt(3) / 2 : 1);

	items: PlantItem[] = $state(items);
	public getItems = () => this.items;
	public newItem = () => this.items.push(blankItem());
	public deleteItem = (index: number) => this.items.splice(index, 1);

	public totalArea = $state(5000);
	public totalProportion = $derived.by(() =>
		this.getItems().reduce((sum, item: PlantItem) => sum + (Number(item.proportion) || 0), 0)
	);

	public proportionError = $derived(
		this.totalProportion < 0 || this.totalProportion > 100
			? 'Total proportion must total 100%.'
			: ''
	);

	public getItemStats = (item: PlantItem) => {
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

	public downloadCsv = () => {
		const rows = this.items.map((item) => {
			const { allocatedArea, plants } = this.getItemStats(item);
			return [
				item.desc,
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
	};
}

export { PlantCalculator, type PlantItem, type Packing, headers };
