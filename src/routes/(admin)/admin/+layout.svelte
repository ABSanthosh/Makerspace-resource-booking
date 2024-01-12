<script lang="ts">
	import Sidebar from '$components/Sidebar.svelte';
	import { ADMIN_ROUTES } from '$lib/routes';
	import type { User } from '@supabase/supabase-js';
	import type { PageData } from './$types';

	export let data;

	$: ({ user } = data!.session!);
	$: ({ supabase } = data);

	$: console.log(supabase)
</script>

<main class="AdminLayout">
	<Sidebar {supabase} {user} routes={ADMIN_ROUTES} />

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
