<script lang="ts">
	import HomeNavigation from '$components/HomeNavigation.svelte';
	import Google from '$components/Google.svelte';

	export let { pathname } = $$props as {
		pathname: string;
	};
</script>

<header class="HeaderWrapper">
	<div class="Header">
		<div class="Header__left">LOGO</div>
		<div class="Header__right">
			<HomeNavigation {pathname} isHeader={true} />
			<Google />
		</div>
	</div>
</header>

<style lang="scss">
	.HeaderWrapper {
		top: 0;
		left: 0;
		right: 0;
		gap: 10px;
		z-index: 5;
		position: fixed;
		@include box(100%, 64px);
		background: #ffffff50;
		box-shadow: 0px 4px 14px 0px rgba(0, 0, 0, 0.06);
		backdrop-filter: blur(5px);
		@include make-flex();
	}
	.Header {
		align-items: center;
		@include box();
		max-width: $maxWidth;
		@include make-flex($dir: row, $just: space-between);

		padding: 16px 20px;

		&__right {
			@include make-flex($dir: row, $just: flex-end);
			gap: 15px;
			@include box(100%, auto);
		}
	}
</style>
