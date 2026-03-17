<script lang="ts">
	type LayoutMode = 'square' | 'triangular';

	type PlantRow = {
		id: string;
		name: string;
		proportion: number;
		spacing: number;
	};

	type PlantResult = PlantRow & {
		allocatedArea: number;
		areaPerPlant: number;
		count: number;
		spacingMode: LayoutMode;
		valid: boolean;
	};

	const layoutCalculators: Record<LayoutMode, (spacing: number) => number> = {
		square: (spacing: number) => spacing * spacing,
		triangular: (spacing: number) => spacing * spacing * (Math.sqrt(3) / 2)
	};

	const spacingMode: LayoutMode = 'square';
	const wordmark = '/logos/logo_wordmark_green.webp';
	const logomark = '/logos/logo_logomark_blue.webp';

	const createPlantRow = (index: number): PlantRow => ({
		id: crypto.randomUUID(),
		name: index === 1 ? 'Harakeke' : '',
		proportion: index === 1 ? 100 : 0,
		spacing: index === 1 ? 1.2 : 1
	});

	const formatNumber = (value: number, maximumFractionDigits = 2) =>
		new Intl.NumberFormat('en-NZ', {
			maximumFractionDigits,
			minimumFractionDigits: 0
		}).format(value);

	const formatCount = (value: number) =>
		new Intl.NumberFormat('en-NZ', { maximumFractionDigits: 0 }).format(value);

	let area = $state(100);
	let plants = $state<PlantRow[]>([createPlantRow(1)]);

	let safeArea = $derived(Number.isFinite(area) ? area : 0);
	let totalProportion = $derived(
		plants.reduce(
			(total, plant) => total + (Number.isFinite(plant.proportion) ? plant.proportion : 0),
			0
		)
	);
	let remainingProportion = $derived(100 - totalProportion);
	let proportionBalanced = $derived(Math.abs(totalProportion - 100) < 0.001);

	let validPlantCount = $derived(
		plants.filter(
			(plant) =>
				plant.name.trim().length > 0 &&
				Number.isFinite(plant.proportion) &&
				plant.proportion > 0 &&
				Number.isFinite(plant.spacing) &&
				plant.spacing > 0
		).length
	);

	let results = $derived.by<PlantResult[]>(() => {
		const calculateAreaPerPlant = layoutCalculators[spacingMode];

		return plants.map((plant) => {
			const proportion = Number.isFinite(plant.proportion) ? plant.proportion : 0;
			const spacing = Number.isFinite(plant.spacing) ? plant.spacing : 0;
			const allocatedArea = safeArea > 0 ? safeArea * (proportion / 100) : 0;
			const areaPerPlant = spacing > 0 ? calculateAreaPerPlant(spacing) : 0;
			const valid = safeArea > 0 && proportion > 0 && spacing > 0 && plant.name.trim().length > 0;

			return {
				...plant,
				proportion,
				spacing,
				allocatedArea,
				areaPerPlant,
				count: valid && areaPerPlant > 0 ? Math.floor(allocatedArea / areaPerPlant) : 0,
				spacingMode,
				valid
			};
		});
	});

	let totalPlants = $derived(results.reduce((total, result) => total + result.count, 0));

	const addPlant = () => {
		plants = [...plants, createPlantRow(plants.length + 1)];
	};

	const removePlant = (id: string) => {
		if (plants.length === 1) {
			plants = [createPlantRow(1)];
			return;
		}

		plants = plants.filter((plant) => plant.id !== id);
	};
</script>

<svelte:head>
	<title>Nairis Nursery Plant Calculator</title>
	<meta
		name="description"
		content="Estimate how many plants fit into an area using Nairis Nursery's static plant calculator."
	/>
</svelte:head>

<div class="page-shell">
	<header class="topbar">
		<img class="topbar__wordmark" src={wordmark} alt="Nairis Nursery" />
		<p class="topbar__note">Plant calculator</p>
	</header>

	<section class="intro-card">
		<div class="intro-copy">
			<p class="kicker">Regeneration, community, legacy</p>
			<h1>Plan your planting mix with a calm, simple estimate.</h1>
			<p>
				Enter the total area in square metres, assign each plant a proportion of that area, and
				estimate how many plants fit using square spacing. The calculation layer is already
				structured so triangular spacing can be added later.
			</p>
		</div>

		<div class="intro-aside">
			<img class="intro-aside__mark" src={logomark} alt="Nairis Nursery logomark" />
			<div>
				<p class="meta-label">Spacing mode</p>
				<p class="meta-value">Square grid in metres</p>
			</div>
			<div>
				<p class="meta-label">Use case</p>
				<p class="meta-value">Early planting plans and area allocation</p>
			</div>
		</div>
	</section>

	<section class="content-grid">
		<div class="panel panel--form">
			<div class="section-heading">
				<div>
					<p class="section-label">Inputs</p>
					<h2>Set the area and build your plant list</h2>
				</div>
				<p class="section-copy">
					Each row receives a share of the total area based on its percentage.
				</p>
			</div>

			<label class="field field--area">
				<span>Total planting area (m²)</span>
				<input
					type="number"
					min="0"
					step="0.1"
					bind:value={area}
					placeholder="e.g. 250"
					inputmode="decimal"
				/>
			</label>

			<div class="plant-list">
				{#each plants as plant, index (plant.id)}
					<section class="plant-row">
						<div class="plant-row__header">
							<div>
								<p class="row-label">Plant {index + 1}</p>
								<h3>{plant.name.trim() || 'Untitled plant'}</h3>
							</div>
							<button
								type="button"
								class="text-button"
								onclick={() => removePlant(plant.id)}
								aria-label={`Remove plant ${index + 1}`}
							>
								Remove
							</button>
						</div>

						<div class="field-grid">
							<label class="field field--wide">
								<span>Plant name</span>
								<input bind:value={plant.name} placeholder="e.g. Manuka" />
							</label>

							<label class="field">
								<span>Proportion (%)</span>
								<input
									type="number"
									min="0"
									step="1"
									bind:value={plant.proportion}
									placeholder="0"
									inputmode="decimal"
								/>
							</label>

							<label class="field">
								<span>Spacing (m)</span>
								<input
									type="number"
									min="0"
									step="0.01"
									bind:value={plant.spacing}
									placeholder="0.0"
									inputmode="decimal"
								/>
							</label>
						</div>
					</section>
				{/each}
			</div>

			<div class="panel-actions">
				<button type="button" class="pill-button" onclick={addPlant}>Add another plant</button>
			</div>
		</div>

		<aside class="panel panel--summary">
			<div class="section-heading section-heading--stacked">
				<div>
					<p class="section-label">Live estimate</p>
					<h2>Plant totals</h2>
				</div>
			</div>

			<div class="summary-metrics">
				<div class="metric">
					<p class="meta-label">Estimated plants</p>
					<p class="metric__value">{formatCount(totalPlants)}</p>
				</div>
				<div class="metric">
					<p class="meta-label">Rows ready</p>
					<p class="metric__value metric__value--small">{validPlantCount}/{plants.length}</p>
				</div>
			</div>

			<div class="summary-status">
				<p class:status={true} class:status--ok={safeArea > 0} class:status--warn={safeArea <= 0}>
					Area {safeArea > 0 ? 'set' : 'required'}
				</p>
				<p
					class:status={true}
					class:status--ok={proportionBalanced}
					class:status--warn={!proportionBalanced}
				>
					Proportion {formatNumber(totalProportion)}%
				</p>
			</div>

			<p class="summary-note">
				{#if proportionBalanced}
					The whole planting area is allocated across your current mix.
				{:else if totalProportion < 100}
					There is {formatNumber(Math.abs(remainingProportion))}% of the area still unassigned.
				{:else}
					The list is over-allocated by {formatNumber(Math.abs(remainingProportion))}%.
				{/if}
			</p>

			<div class="result-list">
				{#each results as result (result.id)}
					<article class="result-item">
						<div class="result-item__top">
							<div>
								<p class="row-label">{result.name.trim() || 'Untitled plant'}</p>
								<p class="result-item__meta">
									{formatNumber(result.proportion)}% of {formatNumber(safeArea)} m²
								</p>
							</div>
							<p class="result-item__count">{formatCount(result.count)}</p>
						</div>

						<div class="result-item__details">
							<p>{formatNumber(result.allocatedArea)} m² allocated</p>
							<p>{formatNumber(result.spacing)} m square spacing</p>
						</div>

						{#if !result.valid}
							<p class="result-item__warning">
								Add a name, a positive proportion, and a spacing above zero for this row.
							</p>
						{/if}
					</article>
				{/each}
			</div>
		</aside>
	</section>
</div>

<style>
	:global(body) {
		margin: 0;
	}

	.page-shell {
		max-width: 1180px;
		margin: 0 auto;
		padding: 1.5rem 1rem 4rem;
	}

	.topbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding-bottom: 1rem;
	}

	.topbar__wordmark {
		width: min(220px, 48vw);
		height: auto;
	}

	.topbar__note,
	.kicker,
	.section-label,
	.row-label,
	.meta-label,
	.result-item__meta,
	.status {
		margin: 0;
		font-size: 0.76rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.topbar__note,
	.kicker,
	.section-label,
	.row-label,
	.meta-label,
	.result-item__meta {
		color: var(--color-muted);
	}

	.intro-card,
	.panel {
		background: rgba(251, 251, 235, 0.78);
		border: 1px solid rgba(117, 112, 46, 0.14);
		box-shadow: var(--shadow-soft);
	}

	.intro-card {
		display: grid;
		grid-template-columns: minmax(0, 1.5fr) minmax(260px, 0.8fr);
		gap: 2rem;
		padding: 2rem;
		border-radius: 2rem 2rem 2.75rem 2.75rem;
		margin-bottom: 1.5rem;
	}

	.intro-copy h1,
	.section-heading h2,
	.plant-row h3 {
		margin: 0;
		font-weight: 300;
		letter-spacing: -0.03em;
		line-height: 1.05;
	}

	.intro-copy h1 {
		font-size: clamp(2.3rem, 5vw, 4.15rem);
		max-width: 11ch;
		color: var(--color-green);
	}

	.intro-copy p,
	.section-copy,
	.summary-note,
	.result-item__details,
	.result-item__warning {
		margin: 0;
		font-size: 0.98rem;
		line-height: 1.7;
	}

	.intro-copy p:last-child {
		max-width: 46rem;
		margin-top: 1rem;
	}

	.intro-aside {
		display: grid;
		gap: 1.25rem;
		align-content: end;
		padding: 1.5rem;
		border-radius: 1.5rem;
		background: rgba(200, 231, 224, 0.46);
	}

	.intro-aside__mark {
		width: 74px;
		height: auto;
	}

	.meta-value {
		margin: 0.25rem 0 0;
		font-size: 1rem;
		line-height: 1.5;
	}

	.content-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.3fr) minmax(320px, 0.85fr);
		gap: 1.5rem;
	}

	.panel {
		padding: 1.5rem;
		border-radius: 1.75rem;
	}

	.panel--summary {
		background: rgba(200, 231, 224, 0.44);
	}

	.section-heading {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		align-items: end;
		margin-bottom: 1.25rem;
	}

	.section-heading--stacked {
		margin-bottom: 1rem;
	}

	.section-heading h2 {
		font-size: clamp(1.45rem, 2.8vw, 2.2rem);
		color: var(--color-green);
	}

	.section-copy {
		max-width: 24rem;
		color: var(--color-muted);
	}

	.field-grid {
		display: grid;
		grid-template-columns: 1.45fr 0.8fr 0.8fr;
		gap: 0.85rem;
	}

	.field {
		display: grid;
		gap: 0.45rem;
	}

	.field--area {
		margin-bottom: 1rem;
	}

	.field span {
		font-size: 0.8rem;
		color: var(--color-muted);
	}

	.field input {
		width: 100%;
		padding: 0.9rem 1rem;
		border-radius: 999px;
		border: 1px solid rgba(117, 112, 46, 0.18);
		background: rgba(255, 255, 255, 0.7);
		color: var(--color-text);
	}

	.field input::placeholder {
		color: rgba(44, 43, 27, 0.42);
	}

	.field input:focus {
		outline: 2px solid rgba(117, 112, 46, 0.18);
		border-color: rgba(117, 112, 46, 0.35);
	}

	.plant-list,
	.result-list {
		display: grid;
		gap: 0.85rem;
	}

	.plant-row,
	.metric,
	.result-item {
		background: rgba(255, 255, 255, 0.48);
		border: 1px solid rgba(117, 112, 46, 0.12);
		border-radius: 1.4rem;
	}

	.plant-row {
		padding: 1rem;
	}

	.plant-row__header,
	.result-item__top,
	.panel-actions,
	.summary-metrics,
	.summary-status {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.plant-row__header {
		align-items: start;
		margin-bottom: 0.95rem;
	}

	.plant-row h3 {
		font-size: 1.2rem;
		font-weight: 400;
		color: var(--color-green);
	}

	.text-button,
	.pill-button {
		appearance: none;
		font: inherit;
		cursor: pointer;
		transition:
			background-color 160ms ease,
			transform 160ms ease,
			border-color 160ms ease;
	}

	.text-button {
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--color-muted);
	}

	.pill-button {
		padding: 0.85rem 1.1rem;
		border-radius: 999px;
		border: 1px solid rgba(117, 112, 46, 0.25);
		background: rgba(200, 231, 224, 0.42);
		color: var(--color-green);
	}

	.text-button:hover,
	.pill-button:hover {
		transform: translateY(-1px);
	}

	.pill-button:hover {
		background: rgba(200, 231, 224, 0.62);
	}

	.summary-metrics {
		margin-bottom: 1rem;
	}

	.metric {
		flex: 1;
		padding: 1rem;
	}

	.metric__value {
		margin: 0.35rem 0 0;
		font-size: clamp(2rem, 4vw, 2.8rem);
		line-height: 1;
		font-weight: 300;
		color: var(--color-green);
	}

	.metric__value--small {
		font-size: clamp(1.5rem, 3vw, 2rem);
	}

	.summary-status {
		flex-wrap: wrap;
		margin-bottom: 0.9rem;
	}

	.status {
		padding: 0.6rem 0.8rem;
		border-radius: 999px;
		border: 1px solid transparent;
	}

	.status--ok {
		background: rgba(117, 112, 46, 0.1);
		border-color: rgba(117, 112, 46, 0.16);
	}

	.status--warn {
		background: rgba(255, 255, 255, 0.52);
		border-color: rgba(117, 112, 46, 0.12);
	}

	.summary-note {
		color: var(--color-muted);
		margin-bottom: 1rem;
	}

	.result-item {
		padding: 1rem;
	}

	.result-item__count {
		margin: 0;
		font-size: 2rem;
		line-height: 1;
		font-weight: 300;
		color: var(--color-green);
	}

	.result-item__details {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		margin-top: 0.7rem;
		color: var(--color-muted);
	}

	.result-item__details p,
	.result-item__warning {
		margin: 0;
	}

	.result-item__warning {
		margin-top: 0.65rem;
		color: rgba(93, 81, 25, 0.86);
	}

	@media (max-width: 900px) {
		.intro-card,
		.content-grid,
		.field-grid {
			grid-template-columns: 1fr;
		}

		.section-heading,
		.plant-row__header,
		.summary-metrics,
		.result-item__details {
			flex-direction: column;
		}

		.page-shell {
			padding-inline: 0.85rem;
		}
	}
</style>
