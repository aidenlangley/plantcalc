<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import MainSidebar from '$lib/components/MainSidebar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="stylesheet" href="/fonts/fonts.css" />
</svelte:head>

<div class="container">
	<header>
		<Header />
	</header>
	<main class="column">
		{@render children()}
	</main>
	<aside>
		<MainSidebar />
	</aside>
	<footer>
		<Footer />
	</footer>
</div>

<style>
	:root {
		--grid-gap: 1rem;
		--grid-padding: 1rem 1.5rem;
	}

	.container {
		display: grid;
		grid-template-columns: 3fr 1fr;
		grid-template-rows: auto;
		grid-template-areas:
			'header header'
			'main sidebar'
			'footer footer';

		grid-column-gap: var(--grid-gap);
		place-self: center;
	}

	@media (prefers-reduced-motion: no-preference) {
		.container {
			transition: all 1s;
		}
	}

	.container > * {
		padding: var(--grid-padding);
	}

	header {
		grid-area: header;
	}

	main {
		grid-area: main;
	}

	aside {
		grid-area: siderbar;
		justify-content: left;
	}

	footer {
		grid-area: footer;
	}
</style>
