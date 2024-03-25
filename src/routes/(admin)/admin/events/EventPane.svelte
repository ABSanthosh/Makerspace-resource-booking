<script lang="ts">
	import Pane from '$components/Pane.svelte';
	import type { Writable } from 'svelte/store';
	import type { ECategories } from '@prisma/client';
	import type { ESchema, EventSchema } from '$lib/schemas';
	import { superForm } from 'sveltekit-superforms/client';
	import UploadImage from '$components/UploadImage.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import TipTap from '$components/TipTap.svelte';
	import { addToast } from '$store/ToastStore';

  export let { modal, formStore, resetForm } = $$props as {
		modal: boolean;
		resetForm: (form: Writable<EventSchema>) => void;
		formStore: SuperValidated<EventSchema>;
	};

  const { form, errors, enhance, tainted, constraints, formId } = superForm(formStore, {
		id: 'eventForm',
		dataType: 'json',
		onResult(event) {
			if (event.result.status === 200) {
				modal = false;
				addToast({
					message:
						$form?.id !== undefined
							? 'Event updated successfully'
							: 'Event added successfully'
				});
				resetForm(form);
			}
		},
		taintedMessage: null
	});


	$: paneTitle = 'Add Event';
	$: if ($form?.id) {
		paneTitle = 'Edit Event';
	}
</script>

<Pane
	bind:open={modal}
	style="--paneWidth: 485px;"
	on:close={() => {
		resetForm(form);
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
			action="/admin/events?/upsertEvent"
		>
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

			<label class="CrispLabel" for="shortDescription">
				<span data-mandatory style="color: inherit;"> Short Description </span>
				<textarea
					id="shortDescription"
					name="shortDescription"
					class="CrispInput"
					data-type="text-area"
					bind:value={$form.shortDescription}
					aria-invalid={$errors.shortDescription ? 'true' : undefined}
					{...$constraints.shortDescription}
				/>
				{#if $errors.shortDescription}
					<p class="CrispMessage w-100" data-type="error">
						{$errors.shortDescription}
					</p>
				{/if}
			</label>

			<label class="CrispLabel" for="description">
				<span data-mandatory style="color: inherit;"> Description </span>
				<textarea
					id="description"
					name="description"
					class="CrispInput"
					data-type="text-area"
					bind:value={$form.description}
					aria-invalid={$errors.description ? 'true' : undefined}
					{...$constraints.description}
				/>
				{#if $errors.description}
					<p class="CrispMessage w-100" data-type="error">
						{$errors.description}
					</p>
				{/if}
			</label>

			<UploadImage name="image" bind:errors={$errors.image} bind:image={$form.image} />
			
			<label
				class="CrispLabel"
				for="date"
				data-direction="row"
				style="justify-content: space-between;"
			>
				<span data-mandatory style="color: inherit;"> Date </span>
				<input
					id="date"
					type="date"
					name="date"
					class="CrispInput"
					style="--crp-input-width: 40%"
					bind:value={$form.date}
					aria-invalid={$form.date ? 'true' : undefined}
				/>
			</label>
			{#if $errors.date}
				<p class="CrispMessage w-100" data-type="error">
					{$errors.date}
				</p>
			{/if}
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
			}}
		>
			Cancel
		</button>
		<button
			form={$formId}
			class="CrispButton"
			data-type="dark"
			type="submit"
			disabled={$form?.id !== undefined && $tainted === undefined}
		>
			{$form?.id !== undefined ? 'Update' : 'Submit'}
		</button>
	</div>
</Pane>