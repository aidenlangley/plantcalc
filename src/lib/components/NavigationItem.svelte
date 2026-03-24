<script lang="ts">
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';

	interface NavigationItemProps {
		url: string;
		title: string;
	}

	let { url, title }: NavigationItemProps = $props();
</script>

<NavigationMenu.Item>
	<NavigationMenu.Link href={url}>{title}</NavigationMenu.Link>
</NavigationMenu.Item>

<style>
</style>
