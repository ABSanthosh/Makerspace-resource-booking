<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { fly } from 'svelte/transition';
	import Header from '$components/Header.svelte';
	import HomeNavigation from '$components/HomeNavigation.svelte';

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


</script>

<Header />
<main class="HomeLayout w-100">
	<HomeNavigation pathname={data.pathname} />
	{#key data.pathname}
		<div
			class="HomeLayout__content w-100"
			in:fly={{ x: -100, duration: 200, delay: 200 }}
			out:fly={{ x: 100, duration: 200 }}
		>
			<slot />
		</div>
	{/key}
</main>

<style lang="scss" global>
	@import '../styles/root/global.scss';

	.HomeLayout {
		@include box($height: auto);
		@include make-flex($just: flex-start);
		padding: 30px 20px 20px 20px;
		margin-top: 84px;
		max-width: $maxWidth;
		gap: 15px;

		// background-color: aliceblue;

		@include make-flex($dir: row, $align: flex-start);
		gap: 24px;

		@include respondAt(630px) {
			flex-direction: column;
		}

		&__content {
			@include make-flex($just: flex-start);
		}
	}
</style>
