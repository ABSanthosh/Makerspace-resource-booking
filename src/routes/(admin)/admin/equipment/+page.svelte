<script lang="ts">
	import type { PageData } from './$types';
	import type { ECategoriesSchema, ESchema } from '$lib/schemas';
	import { type Writable } from 'svelte/store';
	import EquipmentPane from './FormPanes/EquipmentPane.svelte';
	import Pane from '$components/Pane.svelte';
	export let data: PageData;

	$: ({ newEquipmentForm, editEquipmentForm, allEquipment, eCategories } = data);
	$: addEquipmentModal = false;
	$: editEquipmentModal = false;
	$: editItem = {} as ESchema | null;

	$: addCategoryModal = false;
	$: eCategoriesModal = false;
	$: categoryItem = {} as ECategoriesSchema;

	const resetForm = (form: Writable<ESchema>) => {
		form.set({
			name: '',
			model: '',
			image: '',
			instances: [],
			description: '',
			eCategoriesId: '',
			imageFile: undefined
		});
	};

	$: equipmentSearch = '';
	$: searchEquipment = allEquipment?.filter((item) =>
		item.name.toLowerCase().includes(equipmentSearch.toLowerCase())
	);
</script>

<EquipmentPane
	{resetForm}
	bind:editItem
	bind:eCategories
	bind:modal={addEquipmentModal}
	bind:formStore={newEquipmentForm}
	bind:editFormStore={editEquipmentForm}
/>

<!-- <Pane
	bind:open={eCategoriesModal}
	style="--paneWidth: 450px;"
	on:close={() => (eCategoriesModal = false)}
>
	<p slot="header">Categories</p>
	{#if eCategories}
		<form style="overflow:hidden" method="POST" action="">
			<table class="FancyTable">
				<thead>
					<tr>
						<th> Name </th>
					</tr>
				</thead>
				<tbody>
					{#each [...eCategories, ...eCategories, ...eCategories, ...eCategories] as item}
						<tr>
							<td>

								{item.name}
							</td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr>
						<td colspan="2">
							Showing {eCategories?.length ?? 0} result(s)
						</td>
					</tr>
				</tfoot>
			</table>
		</form>
	{/if}
	<svelte:fragment slot="footer">
		<button class="FancyButton" style="--height: 30px" data-type="black-outline">
			Add category
		</button>
	</svelte:fragment>
</Pane> -->

<main class="AdminEquipment">
	<header>
		<input
			class="CrispInput"
			type="search"
			style="--crp-input-width: 270px;"
			bind:value={equipmentSearch}
			placeholder="Search equipment"
		/>

		<span class="Row--center gap-15">
			<button
				class="FancyButton"
				data-type="dark-outline"
				on:click={() => (eCategoriesModal = !eCategoriesModal)}
			>
				Add category
			</button>

			<button
				class="FancyButton"
				data-type="dark-blue"
				on:click={() => (addEquipmentModal = !addEquipmentModal)}
			>
				Add equipment
			</button>
		</span>
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
											...item,
											image: item.image.split('?')[0]
										};
										addEquipmentModal = true;
										// editEquipmentModal = true;
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
						Showing {allEquipment?.length ?? 0} result(s)
					</td>
				</tr>
			</tfoot>
		</table>
	</div>
</main>

<style lang="scss">
	.AdminEquipment {
		gap: 24px;
		padding: 24px;
		@include box();
		@include make-flex($just: flex-start);

		& > header {
			@include box($height: auto);
			@include make-flex($dir: row, $just: space-between);
		}

		&__content {
			@include box();
			overflow: auto;
			padding-right: 5px;
			scrollbar-gutter: stable;
			max-height: calc(100vh - 112px);

			&::-webkit-scrollbar {
				width: 6px;
			}
		}
	}
</style>
