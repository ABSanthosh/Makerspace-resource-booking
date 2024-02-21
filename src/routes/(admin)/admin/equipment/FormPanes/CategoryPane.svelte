<script lang="ts">
	import Pane from '$components/Pane.svelte';
	import nanoid from '$lib/nanoid';
	import type { ECategoriesSchema, ECategoryCRUDSchema } from '$lib/schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	export let { eCategories, modal, formStore } = $$props as {
		modal: boolean;
		formStore: SuperValidated<ECategoryCRUDSchema>;
		eCategories: ECategoriesSchema[];
	};

	const {
		form: categoryForm,
		enhance: categoryEnhance,
	} = superForm(formStore, {
		id: 'categoryForm',
		dataType: 'json',
		onSubmit() {
			categoryForm.set({
				add: [...operations.add],
				edit: [...operations.edit],
				delete: [...operations.delete].map((i) => i.id)
			});
		},
		onResult(event) {
			if (event.result.status === 200) {
				modal = false;
				addModeItem = null;
				editModeItem = null;
				operations = {
					add: [],
					edit: [],
					delete: []
				};
			}
		},
		taintedMessage: null
	});

	$: operations = {
		add: [],
		edit: [],
		delete: []
	} as { add: ECategoriesSchema[]; edit: ECategoriesSchema[]; delete: ECategoriesSchema[] };

	$: editModeItem = null as ECategoriesSchema | null;
	$: addModeItem = null as ECategoriesSchema | null;

	const newInputFocus = (element: HTMLInputElement, id: string) => {
		if (id === addModeItem?.id) {
			element.focus();
		}
	};
</script>

<Pane bind:open={modal} style="--paneWidth: 450px;" on:close={() => (modal = false)}>
	<p slot="header">Categories</p>
	<svelte:fragment slot="main">
		{#if eCategories}
			<form
				method="POST"
				id="categoryForm"
				use:categoryEnhance
				style="overflow:hidden"
				action="/admin/equipment?/categoryCRUD"
			>
				<table class="FancyTable">
					<thead>
						<tr>
							<th style="width: 100%;"> Name </th>
							<th
								style="width: 140px; padding: 12px; display: flex; flex-direction: row; gap: 12px; justify-content: flex-end"
							>
								<button
									type="button"
									class="CrispButton"
									disabled={!operations.add.every((i) => i.name.trim() !== '')}
									on:click={() => {
										// Doc: if all of the operations are not empty, then the button is disabled
										if (!operations.add.every((i) => i.name.trim() !== '')) {
											return;
										}

										// Doc: if edit is already on, save it to the operations.edit and reset the editModeItem
										if (editModeItem !== null) {
											operations.edit = [...operations.edit, editModeItem];
											editModeItem = null;
										}

										addModeItem = {
											name: '',
											id: nanoid()
										};

										operations.add = [...operations.add, addModeItem];
									}}
								>
									Add category
								</button>
							</th>
						</tr>
					</thead>
					<tbody>
						{#each eCategories as item}
							<tr
								class:edit={operations.edit.map((i) => i.id).includes(item.id)}
								class:delete={operations.delete.map((i) => i.id).includes(item.id)}
							>
								<td
									style="max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
								>
									{#if editModeItem?.id === item.id}
										<input
											type="text"
											class="CrispInput"
											style="--crp-input-height: 32px"
											bind:value={item.name}
											on:change={() => {
												operations.edit = [
													...operations.edit.filter((i) => i.id !== item.id),
													item
												];
											}}
										/>
									{:else}
										{item.name}
									{/if}
								</td>
								<td
									style="width: 140px; padding: 12px; display: flex; flex-direction: row; gap: 12px; justify-content: flex-end"
								>
									{#if editModeItem?.id === item.id}
										<button
											type="button"
											class="CrispButton"
											style="--crp-button-width: 30px"
											data-type="success"
											data-icon={String.fromCharCode(59510)}
											on:click={() => {
												editModeItem = null;
											}}
										/>

										<button
											type="button"
											class="CrispButton"
											style="--crp-button-width: 30px"
											data-type="danger"
											data-icon={String.fromCharCode(58829)}
											on:click={() => {
												if (editModeItem) {
													item = { ...editModeItem };
													operations.edit = operations.edit.filter((i) => i.id !== item.id);
												}
												editModeItem = null;
											}}
										/>
									{:else}
										<button
											type="button"
											class="CrispButton"
											style="--crp-button-width: 30px"
											data-icon={String.fromCharCode(58313)}
											on:click={() => {
												if (editModeItem?.id !== item.id) editModeItem = { ...item };
												else editModeItem = null;
											}}
										/>
										<button
											type="button"
											data-type="danger"
											class="CrispButton"
											style="--crp-button-width: 30px"
											data-icon={String.fromCharCode(59506)}
											on:click={() => {
												operations.delete = [...operations.delete, item];
											}}
										/>
									{/if}
								</td>
							</tr>
						{/each}
						{#each operations.add as item}
							<tr class="add">
								<td>
									<input
										type="text"
										class="CrispInput"
										bind:value={item.name}
										use:newInputFocus={item.id}
										style="--crp-input-height: 32px"
										on:change={() => {
											operations.add = [...operations.add.filter((i) => i.id !== item.id), item];
										}}
									/>
								</td>
								<td
									style="width: 140px; padding: 12px; display: flex; flex-direction: row; gap: 12px; justify-content: flex-end"
								>
									{#if addModeItem?.id === item.id}
										<button
											type="button"
											class="CrispButton"
											style="--crp-button-width: 30px"
											data-type="success"
											disabled={item.name.trim() === ''}
											data-icon={String.fromCharCode(59510)}
											on:click={() => {
												if (item.name.trim() === '') return;
												addModeItem = null;
											}}
										/>
										<button
											type="button"
											class="CrispButton"
											style="--crp-button-width: 30px"
											data-type="danger"
											data-icon={String.fromCharCode(58829)}
											on:click={() => {
												if (addModeItem) {
													item = { ...addModeItem };
													operations.add = operations.add.filter((i) => i.id !== item.id);
												}
												addModeItem = null;
											}}
										/>
									{:else}
										<button
											type="button"
											class="CrispButton"
											style="--crp-button-width: 30px"
											data-icon={String.fromCharCode(58313)}
											on:click={() => {
												if (editModeItem?.id !== item.id) editModeItem = { ...item };
												else editModeItem = null;
											}}
										/>
										<button
											type="button"
											data-type="danger"
											class="CrispButton"
											style="--crp-button-width: 30px"
											data-icon={String.fromCharCode(59506)}
											on:click={() => {
												operations.add = operations.add.filter((i) => i.id !== item.id);
											}}
										/>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
					<tfoot>
						<tr>
							<td colspan="3">
								Showing {eCategories?.length ?? 0} result(s)
							</td>
						</tr>
					</tfoot>
				</table>
			</form>
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="footer">
		<button
			class="CrispButton"
			form="categoryForm"
			style="--height: 30px"
			data-type="black-outline"
			disabled={operations.add.length === 0 &&
				operations.edit.length === 0 &&
				operations.delete.length === 0}
		>
			Update
		</button>
	</svelte:fragment>
</Pane>

<style lang="scss">
	.edit {
		& > * {
			background-color: var(--lightOrange);
			color: var(--orange);

			& > button {
				background-color: var(--lightOrange);
				border-color: var(--orange);
				&::before {
					color: var(--orange);
				}
			}
		}
	}

	.delete {
		& > * {
			background-color: var(--paleRed);
			color: var(--lightRed);

			& > button {
				background-color: var(--paleRed);
				border-color: var(--lightRed);
				&::before {
					color: var(--lightRed);
				}
			}
		}
	}

	.add {
		& > * {
			background-color: var(--lightGreen);
			color: var(--green);

			& > button {
				background-color: var(--lightGreen);
				border-color: var(--green);
				&::before {
					color: var(--green);
				}
			}
		}
	}
</style>
