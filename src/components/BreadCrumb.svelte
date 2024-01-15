<script lang="ts">
	export let crumbs = $$props as {
		name: string;
		path: string;
	}[];
</script>

<ul class="BreadCrumb">
	{#each crumbs as item}
		<li>
			<a href={item.path}>{item.name}</a>
		</li>
	{/each}
</ul>

<style lang="scss">
	.BreadCrumb {
		@include make-flex($dir: row, $just: flex-start);
		background-color: var(--lightBlue);
		padding: 5px 15px;
		border-radius: 6px;
		@include box();
		flex-wrap: wrap;
		column-gap: 5px;
    
		& > li + li:before {
      color: var(--iconColor);
			content: '/';
		}
    
		& > li {
      @include make-flex($dir: row);
			gap: 5px;
      padding: 8px 0;

			& > a {
				font-size: 18px;
				color: var(--darkBlue);
				text-decoration: none;
				transition: opacity 0.15s ease-in-out;
        text-transform: capitalize;
			}

			&:not(:last-child) {
				& > a {
					opacity: 0.5;

					&:hover {
						opacity: 1;
					}
				}
			}
		}
	}
</style>
