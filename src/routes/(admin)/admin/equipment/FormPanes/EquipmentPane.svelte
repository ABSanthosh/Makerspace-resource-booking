<script lang="ts">
	import { EStatus } from '@prisma/client';
	import Pane from '$components/Pane.svelte';
	import type { Writable } from 'svelte/store';
	import type { ECategories } from '@prisma/client';
	import type { ESchema } from '$lib/schemas';
	import { superForm } from 'sveltekit-superforms/client';
	import UploadImage from '$components/UploadImage.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import TipTap from '$components/TipTap.svelte';
	import { addToast } from '$store/ToastStore';

	export let { modal, formStore, editFormStore, resetForm, eCategories, editItem } = $$props as {
		modal: boolean;
		editItem: ESchema | null;
		eCategories: ECategories[];
		resetForm: (form: Writable<ESchema>) => void;
		formStore: SuperValidated<ESchema>;
		editFormStore: SuperValidated<ESchema>;
	};

	const {
		form: newForm,
		errors: newErrors,
		enhance: newEnhance,
		tainted: newTainted,
		constraints: newConstraints,
		formId: newFormId
	} = superForm(formStore, {
		id: 'newEquipmentForm',
		dataType: 'json',
		onResult(event) {
			if (event.result.status === 200) {
				modal = false;
				addToast({
					message: 'Equipment added successfully'
				});
				resetForm(newForm);
			}
		},
		taintedMessage: null
	});

	const {
		form: editForm,
		errors: editErrors,
		enhance: editEnhance,
		tainted: editTainted,
		constraints: editConstraints,
		formId: editFormId
	} = superForm(editFormStore, {
		id: 'editEquipmentForm',
		dataType: 'json',
		onResult(event) {
			if (event.result.status === 200) {
				modal = false;
				addToast({
					message: 'Equipment updated successfully'
				});
				resetForm(editForm);
			}
		}
	});

	$: form = newForm;
	$: errors = newErrors;
	$: actionType = 'add';
	$: tainted = newTainted;
	$: constraints = newConstraints;
	$: enhance = newEnhance;
	$: formId = newFormId;
	$: paneTitle = 'Add Equipment';

	$: if (editItem?.id !== undefined) {
		console.log(editItem);
		editForm.set(editItem);
		editTainted.set(undefined);

		if (actionType === 'add' && formId === newFormId) {
			form = editForm;
			errors = editErrors;
			actionType = 'edit';
			formId = editFormId;
			enhance = editEnhance;
			tainted = editTainted;
			paneTitle = 'Edit Equipment';
			constraints = editConstraints;
		}
	}
</script>

<Pane
	bind:open={modal}
	style="--paneWidth: 485px;"
	on:close={() => {
		resetForm(form);
		editItem = null;
	}}
>
	<p slot="header">
		{paneTitle}
	</p>
	<svelte:fragment slot="main">
		<form
			id={$formId}
			use:enhance
			method="POST"
			enctype="multipart/form-data"
			class="Col--center gap-10 w-100"
			action="/admin/equipment?/{actionType}"
		>
			<!-- <SuperDebug data={$form} /> -->
			<label class="CrispLabel" for="eCategoriesId">
				<span data-mandatory style="color: inherit;"> Category </span>
				<select
					class="CrispSelect"
					style="--crp-select-width: 100%;"
					bind:value={$form.eCategoriesId}
					aria-invalid={$errors.eCategoriesId ? 'true' : undefined}
					{...$constraints.eCategoriesId}
				>
					<option value="" disabled selected>Select a Category</option>
					{#each eCategories as item}
						<option value={item.id}>{item.name}</option>
					{/each}
				</select>
				{#if $errors.eCategoriesId}
					<p class="CrispMessage w-100" data-type="error">
						{$errors.eCategoriesId}
					</p>
				{/if}
			</label>

			<label class="CrispLabel" for="name">
				<span data-mandatory style="color: inherit;"> Name </span>
				<input
					id="name"
					type="text"
					name="name"
					class="CrispInput"
					bind:value={$form.name}
					aria-invalid={$errors.name ? 'true' : undefined}
					{...$constraints.name}
				/>
				{#if $errors.name}
					<p class="CrispMessage w-100" data-type="error">
						{$errors.name}
					</p>
				{/if}
			</label>

			<label class="CrispLabel" for="model">
				<span data-mandatory style="color: inherit;"> Model </span>
				<input
					id="model"
					type="text"
					name="model"
					class="CrispInput"
					{...$constraints.model}
					bind:value={$form.model}
					aria-invalid={$errors.model ? 'true' : undefined}
				/>
				{#if $errors.model}
					<p class="CrispMessage w-100" data-type="error">
						{$errors.model}
					</p>
				{/if}
			</label>

			<UploadImage name="image" bind:errors={$errors.image} bind:image={$form.image} />

			<label class="CrispLabel" for="description">
				<span style="color: inherit;"> Description </span>
				<TipTap name="location" bind:content={$form.description} />
				{#if $errors.description}
					<p class="CrispMessage w-100" data-type="error">
						{$errors.description}
					</p>
				{/if}
			</label>
		</form>
	</svelte:fragment>
	<div class="Row--j-end gap-10" slot="footer">
		<button
			type="button"
			class="CrispButton"
			data-type="danger"
			on:click={() => {
				modal = false;
				resetForm(form);
				editItem = null;
			}}
		>
			Cancel
		</button>
		<button
			form={$formId}
			class="CrispButton"
			data-type="dark"
			type="submit"
			disabled={editItem?.id !== undefined && $tainted === undefined}
		>
			{editItem?.id !== undefined ? 'Update' : 'Submit'}
		</button>
	</div>
</Pane>

<style lang="scss">
	// hr {
	// 	width: 100%;
	// 	border: none;
	// 	border-bottom: 1px solid var(--border);
	// }
</style>
