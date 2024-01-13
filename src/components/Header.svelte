<script lang="ts">
	import HomeNavigation from '$components/HomeNavigation.svelte';

	export let { pathname } = $$props as {
		pathname: string;
	};
</script>

<header class="Header">
	<HomeNavigation {pathname} isHeader={true} />
</header>

<style lang="scss">
	.Header {
		align-items: center;
		@include make-flex($dir: row);

		top: 0;
		left: 0;
		right: 0;
		gap: 10px;
		z-index: 5;
		position: fixed;
		padding: 16px 20px;
		@include box(100%, 80px);
		// border-bottom: 1px solid var(--border);

		background: #ffffff50;
		box-shadow: 0px 4px 14px 0px rgba(0, 0, 0, 0.06);
		backdrop-filter: blur(5px);
	}
</style>
