<script lang="ts">
	import type { PageData } from './$types';
	import type { EItemSchema, ESchema } from '$lib/schemas';
	import type { Writable } from 'svelte/store';
	import NewEquipmentPane from './FormPanes/NewEquipmentPane.svelte';
	import EditEquipmentPane from './FormPanes/EditEquipmentPane.svelte';
	export let data: PageData;

	$: ({ newEquipmentForm, editEquipmentForm, allEquipment, eCategories } = data);
	$: addEquipmentModal = false;
	$: editEquipmentModal = false;
	$: instances = [] as EItemSchema[];
	$: editItem = {} as ESchema;

	const resetForm = (form: Writable<ESchema>) => {
		form.set({
			name: '',
			model: '',
			image: '',
			description: '',
			eCategoriesId: '',
			instances: []
		});
		instances = [];
	};
</script>

<NewEquipmentPane
	{resetForm}
	bind:instances
	bind:eCategories
	bind:modal={addEquipmentModal}
	bind:formStore={newEquipmentForm}
/>

<EditEquipmentPane
	{resetForm}
	bind:editItem
	bind:instances
	bind:modal={editEquipmentModal}
	bind:formStore={editEquipmentForm}
/>

<main class="AdminEquipment">
	<button class="FancyButton" on:click={() => (addEquipmentModal = !addEquipmentModal)}>
		Add equipment
	</button>
	<div class="AdminEquipment__content">
		{#if allEquipment}
			{#each allEquipment as item}
				<div class="AdminEquipment__card">
					<img src={item.image} alt={item.name} />
					<h2 class="w-100">{item.name}</h2>
					<p class="w-100">{item.model}</p>
					<button
						class="FancyButton"
						data-icon={String.fromCharCode(58313)}
						style="--height: 34px; --width: auto --font: 15px;"
						on:click={() => {
							editItem = {
								...item,
								// instances: []
							};
							// instances = item.instances ?? [];
							editEquipmentModal = true;
						}}
					>
						Edit
					</button>
				</div>
			{/each}
		{/if}
	</div>
</main>

<style lang="scss">
	.AdminEquipment {
		padding: 20px;

		&__content {
			@include box();
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
			grid-template-rows: repeat(auto-fill, minmax(180px, 1fr));
			gap: 10px;
			padding: 20px;
		}

		&__card {
			@include make-flex($align: unset);
			// @include box(150px, 300px);
			@include box();
			gap: 15px;

			border-radius: 10px;
			padding: 20px;
			background: #fff;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

			& > h2 {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			& > img {
				@include box(100%, 100px);
				object-fit: contain;
			}
		}
	}
</style>
