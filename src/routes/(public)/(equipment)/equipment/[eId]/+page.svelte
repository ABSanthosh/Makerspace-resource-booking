<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { BreadCrumbStore } from '$store/BreadCrumbStore';

	export let data: PageData;

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

	console.log(data.equipment);
</script>

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

		&__hero {
			gap: 15px;
			@include box();
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
	}
</style>
