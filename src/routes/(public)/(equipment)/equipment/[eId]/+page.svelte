<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { BreadCrumbStore } from '$store/BreadCrumbStore';
	import Pane from '$components/Pane.svelte';

	export let data: PageData;
	$: ({ equipment } = data);
	onMount(() => {
		BreadCrumbStore.update(() => {
			return [
				{
					name: 'Home',
					path: '/'
				},
				{
					name: 'Equipment',
					path: '/equipment'
				},
				{
					name: data.equipment.name,
					path: `/equipment/${data.equipment.id}`
				}
			];
		});
	});

	$: availabilityPane = false;
</script>

<Pane bind:open={availabilityPane} style="--paneWidth: 450px;">
	<p slot="header">Availability</p>

	<div slot="footer">
		<button
			class="FancyButton"
			data-type="black-outline"
			on:click={() => (availabilityPane = false)}
		>
			Close
		</button>
	</div>
</Pane>

<main class="Equipment">
	<header class="Equipment__header w-100 gap-10">
		<h1 class="w-100">{data.equipment.name}</h1>
		<p class="w-100">{data.equipment.model}</p>
	</header>

	<section class="Equipment__hero">
		<div class="Equipment__imageBox">
			<img src={data.equipment.image} alt={data.equipment.name} />
		</div>
		<div class="Col--j-start w-100 gap-15">
			<h3 class="w-100">
				Description
				<hr />
			</h3>
			<p class="w-100">{data.equipment.description}</p>
			<h3 class="w-100">
				Resources
				<hr />
			</h3>
			<div class="Row--start w-100 gap-15">
				<a href={'#'} target="_blank" class="FancyButton" data-type="black-outline">Videos</a>
				<a href={'#'} target="_blank" class="FancyButton" data-type="black-outline">Manual</a>
			</div>
		</div>
	</section>
	<section class="Equipment__instance Col--j-start">
		<h3 class="w-100">
			Instances
			<hr />
		</h3>
		<div class="Equipment__tableContainer">
			<table class="FancyTable">
				<thead>
					<tr>
						<th> Instance Name </th>
						<th> Model </th>
						<th> Category </th>
						<th> Cost </th>
						<th> View Availability</th>
					</tr>
				</thead>
				<tbody>
					{#each equipment.instances as item}
						<tr>
							<td>{item.name}</td>
							<td>{equipment.model}</td>
							<td>{equipment.category.name}</td>
							<td>{item.cost}</td>
							<td>
								<button
									class="FancyButton"
									data-type="black-outline"
									on:click={() => (availabilityPane = true)}
								>
									View
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr>
						<td colspan="5">
							Showing {equipment?.instances.length ?? 0} result(s)
						</td>
					</tr>
				</tfoot>
			</table>
		</div>
	</section>
</main>

<style lang="scss">
	.Equipment {
		gap: 25px;
		@include box();
		@include make-flex($align: flex-start);

		&__header {
			@include make-flex();
			@include box($height: auto);

			h1 {
				font-size: 40px;
				font-weight: 500;
			}

			p {
				font-size: 20px;
				font-style: italic;
				font-weight: 400;
				color: var(--subText);
			}
		}

		&__imageBox {
			@include box(350px, 350px);
			padding: 25px;
			border-radius: 10px;
			@include make-flex();
			flex-shrink: 0;
			background-color: white;
			border: 1px solid var(--border);

			@include respondAt(900px) {
				@include box(250px, 250px);
			}
		}

		&__hero,
		&__instance {
			gap: 15px;
			@include box();
			h3 {
				gap: 15px;
				font-size: 25px;
				font-weight: 500;
				@include make-flex($dir: row, $just: flex-start);

				hr {
					margin: 10px 0;
					width: 100%;
					border: 1px solid var(--border);
				}
			}
		}

		&__hero {
			@include make-flex($dir: row, $align: flex-start);

			@include respondAt(730px) {
				flex-direction: column;
			}
			img {
				width: 100%;
				max-width: 500px;
				height: auto;
			}

			p {
				font-size: 18px;
				font-weight: 400;
			}
		}

		&__tableContainer {
			@include box();
			@include make-flex($align: flex-start);
			overflow: auto;
			& > table {
				padding-bottom: 7px;
			}
		}
	}
</style>
