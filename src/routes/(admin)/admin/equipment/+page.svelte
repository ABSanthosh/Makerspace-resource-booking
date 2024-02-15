<script lang="ts">
	import type { PageData } from './$types';
	import type { ESchema } from '$lib/schemas';
	import { type Writable } from 'svelte/store';
	import EquipmentPane from './FormPanes/EquipmentPane.svelte';
	import CategoryPane from './FormPanes/CategoryPane.svelte';
	export let data: PageData;

	$: ({ newEquipmentForm, editEquipmentForm, allEquipment, eCategories, categoryForm } = data);
	$: equipmentModal = false;
	$: editItem = {} as ESchema | null;

	$: eCategoriesModal = false;

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
	bind:modal={equipmentModal}
	bind:formStore={newEquipmentForm}
	bind:editFormStore={editEquipmentForm}
/>

<CategoryPane bind:formStore={categoryForm} bind:eCategories bind:modal={eCategoriesModal} />

<main class="AdminEquipment">
	<header>
		<input
			type="search"
			class="CrispInput"
			bind:value={equipmentSearch}
			placeholder="Search equipment"
		/>
		<span class="Row--center gap-15">
			<button class="CrispButton" on:click={() => (eCategoriesModal = !eCategoriesModal)}>
				Manage categories
			</button>

			<button
				class="CrispButton"
				data-type="dark-blue"
				on:click={() => (equipmentModal = !equipmentModal)}
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
									class="CrispButton"
									data-icon={String.fromCharCode(58835)}
									style="--crp-button-height: 24px; 
												--crp-button-width: auto; 
												--crp-button-padding-left: 6px; 
												--crp-button-padding-right: 6px;"
									data-type="ghost"
									on:click={() => {
										editItem = {
											...item,
											image: item.image.split('?')[0]
										};
										equipmentModal = true;
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
			gap: 15px;
			@include box($height: auto);
			@include make-flex($dir: row, $just: space-between);

			@include respondAt(645px) {
				align-items: flex-end;
				flex-direction: column;
			}
			& > input {
				--crp-input-width: 270px;

				@include respondAt(645px) {
					--crp-input-width: 100%;
				}
			}
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
