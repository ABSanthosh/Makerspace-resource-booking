<script lang="ts">
	import Sidebar from '$components/Sidebar.svelte';
	import { USER_ROUTES } from '$lib/routes';
	// import type { User, Session } from '@supabase/supabase-js';
	// import type { PageData } from './$types';

	// export let data;

	// $: ({ user } = data!.session || ({} as Session));
	// $: ({ supabase } = data);
</script>

<main class="UserLayout">
	<Sidebar routes={USER_ROUTES} />

	<div class="UserLayout__content">
		<slot />
	</div>
</main>

<style lang="scss">
	.UserLayout {
		@include box();
		display: grid;
		grid-template-columns: min-content 1fr;
		grid-template-areas: 'sidebar content';

		@include respondAt(845px) {
			grid-template-columns: 1fr;
			padding-left: 56px;
		}
	}
</style>
