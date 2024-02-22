<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { SupaStore, SessionStore, CMSStore } from '$store/SupaStore';
	import { navigating } from '$app/stores';
	import BlurredSpinner from '$components/BlurredSpinner.svelte';
	export let data;

	// Supabase
	$: ({ supabase, session, content } = data);
	$: SupaStore.set(supabase);
	$: SessionStore.set(session);
	$: CMSStore.set(content!);

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

{#if $navigating}
	<BlurredSpinner />
{/if}
<slot />

<style lang="scss" global>
	@import '../styles/root/global.scss';
</style>
