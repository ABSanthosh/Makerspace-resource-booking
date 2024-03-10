<script lang="ts">
	import type { PageData } from './$types';
	import type { ESchema } from '$lib/schemas';
	import { type Writable } from 'svelte/store';
	import EquipmentPane from './FormPanes/EquipmentPane.svelte';
	import CategoryPane from './FormPanes/CategoryPane.svelte';
	import clickOutside from '$directive/clickOutside';
	import { enhance } from '$app/forms';
	import ManualPane from './FormPanes/ManualPane.svelte';
	import type { Manual, Video } from '@prisma/client';
	import VideoPane from './FormPanes/VideoPane.svelte';

	export let data: PageData;

	$: ({
		newEquipmentForm,
		editEquipmentForm,
		allEquipment,
		eCategories,
		categoryForm,
		manualForm,
		videoForm
	} = data);
	$: equipmentModal = false;
	$: manualModal = false;
	$: videoModal = false;
	$: editItem = {} as (ESchema & { manuals: Manual[]; videos: Video[] }) | null;

	$: eCategoriesModal = false;
	$: editMenuId = '';

	const resetForm = (form: Writable<ESchema>) => {
		form.set({
			name: '',
			model: '',
			image: '',
			instances: [],
			description: '',
			eCategoriesId: ''
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

<ManualPane bind:modal={manualModal} bind:formStore={manualForm} bind:currentEquipment={editItem} />
<VideoPane bind:modal={videoModal} bind:formStore={videoForm} bind:currentEquipment={editItem} />

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
						<tr class:disabled={item.isDeleted} title="Equipment is disabled">
							<td> {item.name} </td>
							<td> {item.model} </td>
							<td> {item.category.name} </td>
							<td> {item.instances.length} </td>
							<td>
								<details
									data-no-marker
									use:clickOutside
									open={editMenuId === item.id}
									class="CrispMenu AdminEquipment__content--menu"
									on:outclick={() => {
										editMenuId = '';
										return false;
									}}
								>
									<summary>
										<button
											class="CrispButton"
											data-icon={String.fromCharCode(58835)}
											style="--crp-button-height: 24px; 
												--crp-button-width: auto; 
												--crp-button-padding-left: 6px; 
												--crp-button-padding-right: 6px;"
											data-type="ghost"
											on:click={() => (editMenuId = item.id)}
										/>
									</summary>
									<ul
										class="AdminEquipment__content--box CrispMenu__content"
										data-align="top"
										data-direction="left"
									>
										<button
											class="CrispButton"
											data-border="false"
											class:active={editMenuId === item.id}
											on:click={() => {
												editItem = {
													...item,
													// Doc: We have to remove the ?cache from the image URL so it won't be cycled
													// the name of the image file when we update the image
													image: item.image.split('?')[0]
												};
												equipmentModal = true;
												editMenuId = '';
											}}
										>
											Edit
										</button>
										<button
											class="CrispButton"
											data-border="false"
											class:active={editMenuId === item.id}
											on:click={() => {
												editItem = {
													...item,
													image: item.image.split('?')[0],
													manuals: item.manuals,
													videos: item.videos
												};
												videoModal = true;
												editMenuId = '';
											}}
										>
											Videos
										</button>
										<button
											class="CrispButton"
											data-border="false"
											class:active={editMenuId === item.id}
											on:click={() => {
												editItem = {
													...item,
													image: item.image.split('?')[0],
													manuals: item.manuals,
													videos: item.videos
												};
												manualModal = true;
												editMenuId = '';
											}}
										>
											Manuals
										</button>
										<form
											use:enhance
											class="w-100"
											method="POST"
											action="/admin/equipment?/{item.isDeleted ? 'enable' : 'delete'}"
											on:submit={() => {
												return confirm(
													`Are you sure you want to ${
														item.isDeleted ? 're-enable' : 'delete'
													} this equipment?`
												);
											}}
										>
											<input type="hidden" name="id" value={item.id} />
											<button
												class="CrispButton"
												data-type={item.isDeleted ? 'success' : 'danger'}
												data-border="false"
												class:active={editMenuId === item.id}
											>
												{item.isDeleted ? 'Enable' : 'Delete'}
											</button>
										</form>
									</ul>
								</details>
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

			.disabled {
				background-color: var(--lightOrangeBrown);
				& > td {
					font-style: italic;
					color: var(--orangeBrown);
					border-top: 1px solid var(--orangeBrown);
					border-bottom: 1px solid var(--orangeBrown);
				}
			}

			&--box {
				@include box(100px, auto);

				button {
					width: 100%;
					// border: 0px solid transparent;

					&.active {
						--crp-button-border: 1px solid #dfe3e6;
					}
				}
			}

			&--menu {
				min-width: unset;
				@include box(34px, 24px);
				--crp-menu-offset: 4px;
				& > summary {
					@include box(34px, 24px);
					border: 1px solid transparent;
					box-shadow: 0px 0px 0px transparent;
					padding: 0;

					&:hover {
						background-color: transparent;
					}

					&::before {
						content: '';
					}
				}
			}
		}
	}
</style>
