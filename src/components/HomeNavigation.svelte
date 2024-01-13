<script lang="ts">
	import clickOutside from '$directive/clickOutside';
	import { HOME_ROUTES } from '$lib/routes';
	export let { pathname, isHeader } = $$props as {
		pathname: string;
		isHeader: boolean;
	};

	$: isNavOpen = false;
</script>

{#if !isHeader}
	<aside class="HomeNav--desktop">
		<ul class="HomeNav__box HomeNav--content" data-align="left">
			{#each HOME_ROUTES as path}
				<a href={path.route} class="HomeNav--item" class:active={path.route === `/${pathname}`}>
					{path.name}
				</a>
			{/each}
		</ul>
	</aside>
{:else}
	<details
		use:clickOutside
		bind:open={isNavOpen}
		class="FancyMenu HomeNav--mobile"
		on:outclick={() => (isNavOpen = false)}
	>
		<summary data-no-marker data-icon={String.fromCharCode(58839)}>
			<!-- get current route name -->
			{HOME_ROUTES.filter((path) => path.route === `/${pathname}`)[0].name}
		</summary>
		<ul class="HomeNav__box FancyMenu__content HomeNav--content" data-align="left">
			{#each HOME_ROUTES as path}
				<a href={path.route} class="HomeNav--item" class:active={path.route === `/${pathname}`}>
					{path.name}
				</a>
			{/each}
		</ul>
	</details>
{/if}

<style lang="scss">
	.HomeNav {
		&__box {
			width: 100%;
			padding: 13px;
			@include make-flex($dir: column, $align: flex-start);
		}
		&--item {
			gap: 8px;
			padding: 8px;
			display: grid;
			align-items: center;
			border-radius: 6px;
			text-decoration: none;
			color: var(--foreground);
			@include box($height: 36px);
			@include make-flex($dir: row, $just: flex-start);
			transition: background-color 0.1s ease-in-out;
			&.active {
				background-color: var(--darkBlue);
				color: white;
			}
			&:not(.active):hover {
				background-color: #f3f4f6;
			}
		}

		&--desktop {
			top: 108px;
			width: auto;
			height: unset;
			width: 220px;
			flex-shrink: 0;
			overflow: auto;
			position: sticky;
			max-height: calc(100vh - 124px);

			border-radius: 15px;
			background: #fff;
			box-shadow: 0px 0px 21.6px 1px rgba(0, 0, 0, 0.04);

			@include respondAt(780px) {
				display: none;
			}
		}

		&--mobile {
			display: none;
			@include box(220px, 36px);

			& > summary {
				&::before {
					right: 8px;
				}
			}

			@include respondAt(780px) {
				display: block;
			}
		}
	}
</style>
