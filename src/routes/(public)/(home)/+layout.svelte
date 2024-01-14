<script lang="ts">
	import HomeNavigation from '$components/HomeNavigation.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	// This is the layout for all routes inside (home) group.
	// It will inherit the layout from (public) group.
</script>

<main class="HomeLayout w-100">
	<HomeNavigation pathname={data.pathname} isHeader={false} />
	<div class="HomeLayout__content w-100">
		<slot />
	</div>
</main>

<style lang="scss">
	.HomeLayout {
		@include box($height: auto);
		@include make-flex($just: flex-start);
		padding: 20px 20px 20px 20px;
		margin-top: 64px;
		max-width: $maxWidth;
		gap: 15px;

		// background-color: aliceblue;

		@include make-flex($dir: row, $align: flex-start);
		gap: 24px;

		@include respondAt(780px) {
			flex-direction: column;
		}

		&__content {
			@include make-flex($just: flex-start);
		}
	}
</style>
