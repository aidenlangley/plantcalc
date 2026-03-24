<script lang="ts">
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
	import NavigationItem from './NavigationItem.svelte';
</script>

<NavigationMenu.Root>
	<NavigationMenu.List>
		<NavigationItem url="/" title="Home" />
		<NavigationItem url="https://nairisnursery.co.nz/" title="Our Nursery" />
	</NavigationMenu.List>
</NavigationMenu.Root>

<style>
</style>
