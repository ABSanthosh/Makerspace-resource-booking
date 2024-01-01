<script lang="ts">
	import Pane from '$components/Pane.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	console.log(data);
	$: open = false;
</script>

<button on:click={() => (open = !open)}>Open</button>
<Pane bind:open>Hello, world!</Pane>

<style lang="scss">
</style>
