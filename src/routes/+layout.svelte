<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export let data;

	// Supabase
	$: ({ supabase, session } = data);

	let supabaseStore = writable<typeof supabase>();
	$: supabaseStore.set(supabase);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((_, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => subscription.unsubscribe();
	});

	// This layout is the root. All routes will inherit this layout.;
	// Add to this page only if you want it to be applied for all routes.
	// All folders are named according to: https://kit.svelte.dev/docs/advanced-routing#advanced-layouts
</script>

<slot />

<style lang="scss" global>
	@import '../styles/root/global.scss';
</style>
