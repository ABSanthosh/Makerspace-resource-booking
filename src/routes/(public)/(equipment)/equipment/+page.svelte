<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { BreadCrumbStore } from '$store/BreadCrumbStore';
	import LabelInput from '$components/LabelInput.svelte';

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
				}
			];
		});
	});

	$: equipmentSearch = '';
	$: categoryFilter = '';
</script>

<main class="Equipment">
	<header class="Equipment__header w-100 gap-15">
		<LabelInput
			noLabel
			label="Search"
			type="search"
			style="--width: 270px;"
			bind:value={equipmentSearch}
			placeholder="Search equipment"
		/>
		<select class="FancySelect" style="--width: 270px;" bind:value={categoryFilter}>
			<option value="">All Categories</option>
			{#each data.categories as item}
				<option value={item.id}>{item.name}</option>
			{/each}
		</select>
	</header>

	<div class="Equipment__content">
		{#each data.allEquipment.filter((item) => {
			if (categoryFilter === '') return item;
			return item.eCategoriesId === categoryFilter;
		}) as item (item.id)}
			<div class="Equipment__card">
				<img src={item.image} alt={item.name} />
				<h2 class="w-100">{item.name}</h2>
				<p class="w-100">{item.model}</p>
				<a href="/equipment/{item.id}" class="FancyButton w-100">Learn more</a>
			</div>
		{/each}
	</div>
</main>

<style lang="scss">
	.Equipment {
		@include make-flex();
		gap: 50px;
		@include box();

		&__header {
			@include make-flex($dir: row, $just: flex-end);
			gap: 15px;

			@include respondAt(535px) {
				flex-direction: column;
				align-items: flex-end;
			}
		}

		&__content {
			@include box();
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
			// grid-template-rows: repeat(auto-fill, minmax(430px, 1fr));
			gap: 15px;
		}

		&__card {
			gap: 10px;
			padding: 20px;
			@include box();
			background: #fff;
			border-radius: 10px;
			@include make-flex($just: flex-start);
			box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);

			& > img {
				border-radius: 7px;
				object-fit: contain;
				@include box(100%, auto);
			}

			& > h2 {
				font-size: 23px;
				font-weight: 600;
			}

			& > a {
				margin-top: auto;
			}
		}
	}
</style>
