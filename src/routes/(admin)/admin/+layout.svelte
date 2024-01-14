<script lang="ts">
	import Sidebar from '$components/Sidebar.svelte';
	import { ADMIN_ROUTES } from '$lib/routes';
	// import type { User, Session } from '@supabase/supabase-js';
	// import type { PageData } from './$types';

	// export let data;

	// $: ({ user } = data!.session || ({} as Session));
	// $: ({ supabase } = data);
</script>

<main class="AdminLayout">
	<Sidebar routes={ADMIN_ROUTES} />

	<div class="AdminLayout__content">
		<slot />
	</div>
</main>

<style lang="scss">
	.AdminLayout {
		@include box();
		display: grid;
		grid-template-columns: min-content 1fr;
		grid-template-areas: 'sidebar content';
	}
</style>
