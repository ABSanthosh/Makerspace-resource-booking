<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export let data;

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
</script>

<slot />

<style lang="scss" global>
	@import '../styles/root/global.scss';
</style>
