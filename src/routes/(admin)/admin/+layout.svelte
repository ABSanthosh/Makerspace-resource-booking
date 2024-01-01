<script lang="ts">
	import Sidebar from '$components/Sidebar.svelte';
	import type { PageData } from './$types';
	import { ADMIN_ROUTES } from '$lib/routes';
	export let data: PageData;
</script>

<main class="AdminLayout">
	<Sidebar
		user={{
			email: data.email,
			userId: data.userId
		}}
		routes={ADMIN_ROUTES}
	/>

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
