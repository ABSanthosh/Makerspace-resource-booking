<script lang="ts">
	import type { PageData } from './$types';
	import type { EItemSchema, ESchema } from '$lib/schemas';
	import { type Writable } from 'svelte/store';
	import NewEquipmentPane from './FormPanes/NewEquipmentPane.svelte';
	import EditEquipmentPane from './FormPanes/EditEquipmentPane.svelte';
	import LabelInput from '$components/LabelInput.svelte';
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

	$: equipmentSearch = '';
	$: searchEquipment = allEquipment?.filter((item) =>
		item.name.toLowerCase().includes(equipmentSearch.toLowerCase())
	);

	// $: temp = Array.from({ length: 100 }, () => allEquipment?.[0]!);
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
	bind:eCategories
	bind:modal={editEquipmentModal}
	bind:formStore={editEquipmentForm}
/>

<main class="AdminEquipment">
	<header>
		<LabelInput
			noLabel
			label="Search"
			type="search"
			style="--width: 270px;"
			bind:value={equipmentSearch}
			placeholder="Search equipment"
		/>
		<button
			class="FancyButton"
			data-type="dark-blue"
			on:click={() => (addEquipmentModal = !addEquipmentModal)}
		>
			Add equipment
		</button>
	</header>
	<div class="AdminEquipment__content">
		<table class="FancyTable">
			<thead>
				<tr>
					<th> Equipment Name </th>
					<th> Model </th>
					<th> Category </th>
					<th> No. of Instances </th>
					<th> </th>
				</tr>
			</thead>
			<tbody>
				{#if searchEquipment && searchEquipment.length > 0}
					{#each searchEquipment as item}
						<tr>
							<td> {item.name} </td>
							<td> {item.model} </td>
							<td> {item.category.name} </td>
							<td> {item.instances.length} </td>
							<td>
								<button
									class="FancyButton"
									data-icon={String.fromCharCode(58835)}
									style="--height: 24px; --width: auto --font: 15px;"
									data-type="empty"
									on:click={() => {
										editItem = {
											...item
										};
										editEquipmentModal = true;
									}}
								/>
							</td>
						</tr>
					{/each}
				{:else}
					<tr class="empty">
						<td colspan="5"> No results found </td>
					</tr>
				{/if}
			</tbody>
			<tfoot>
				<tr>
					<td colspan="5">
						Showing {allEquipment?.length ?? 0} results
					</td>
				</tr>
			</tfoot>
		</table>
	</div>
</main>

<style lang="scss">
	.AdminEquipment {
		padding: 24px;
		@include make-flex($just: flex-start);
		@include box();
		gap: 24px;

		& > header {
			@include box($height: auto);
			@include make-flex($dir: row, $just: space-between);
		}

		&__content {
			@include box();
			max-height: calc(100vh - 112px);
			overflow: auto;
			scrollbar-gutter: stable;
			padding-right: 5px;
			// margin-right: -10px;

			&::-webkit-scrollbar {
				width: 6px;
			}
		}
	}
</style>
