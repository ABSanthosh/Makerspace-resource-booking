<script lang="ts">
	import TipTap from '$components/TipTap.svelte';

	$: content = ""
	$: console.log(content)
</script>

<div class="Admin">
	<aside>
		<h3>Path Content</h3>
	</aside>
	<div class="Admin__content">
		<h1>Admin</h1>
		<p>Admin page</p>
		<TipTap name="test" bind:content />
	</div>
</div>

<style lang="scss">
	.Admin {
		display: grid;
		height: 100vh;
		max-height: 100vh;
		overflow-x: auto;
		grid-template-columns: 255px 1fr;

		& > aside {
			display: grid;
			grid-template-rows: 48px 1fr;
			border-right: 1px solid var(--border);

			& > h3 {
				font-size: 18px;
				font-weight: 500;
				padding: 16px;
				border-bottom: 1px solid var(--border);
			}
		}

		&__content {
			gap: 24px;
			padding: 16px;
			margin: 64px auto;
			max-width: $maxDashWidth;
			@include box($height: auto);
			min-width: 630px;
			@include make-flex($just: flex-start, $align: flex-start);

			& > h1 {
				font-size: 30px;
				font-weight: 500;
			}
		}
	}
</style>
