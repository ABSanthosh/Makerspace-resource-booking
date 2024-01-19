<script lang="ts">
	import Pane from '$components/Pane.svelte';
	import type { Writable } from 'svelte/store';
	import LabelInput from '$components/LabelInput.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { ESchema, EItemSchema, EZodSchema } from '$lib/schemas';
	import { EStatus, type ECategories } from '@prisma/client';
	import UploadImage from '$components/UploadImage.svelte';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import { getStorageUrl } from '$lib/SupabaseUtils';

	export let { modal, formStore, resetForm, editItem, allEquipments, eCategories } = $$props as {
		modal: boolean;
		editItem: ESchema;
		allEquipments: EItemSchema[];
		formStore: SuperValidated<typeof EZodSchema>;
		resetForm: (form: Writable<ESchema>) => void;
		eCategories: ECategories[];
	};

	const { form, errors, enhance } = superForm(formStore, {
		id: 'editEquipmentForm',
		dataType: 'json',
		onResult(event) {
			if (event.result.status === 200) {
				modal = false;
			}
		},
		taintedMessage: null
	});

	// Update the form with the editItem when either of them changes
	$: editItem, $form, form.set(editItem);
</script>

<Pane bind:open={modal} style="--paneWidth: 450px;" on:close={() => resetForm(form)}>
	<p slot="header">Edit Equipment</p>
	<SuperDebug data={$form} />

	<form
		use:enhance
		method="POST"
		action="?/edit"
		id="editEquipmentForm"
		class="Col--center gap-10 w-100"
	>
		<select class="FancySelect" style="--width: 100%;" bind:value={$form.eCategoriesId}>
			<option value="" disabled selected>Select a Category</option>
			{#each eCategories as item}
				<option value={item.id}>{item.name}</option>
			{/each}
		</select>
		<LabelInput
			mandatory
			style="--padxy: 10px; --font: 15px;"
			labelStyle="--width: 100%;"
			name="name"
			type="text"
			bind:value={$form.name}
			bind:error={$errors.name}
			aria-invalid={$form.name ? 'true' : undefined}
		>
			Name
		</LabelInput>
		<LabelInput
			mandatory
			style="--padxy: 10px; --font: 15px;"
			labelStyle="--width: 100%;"
			name="model"
			type="text"
			bind:value={$form.model}
			bind:error={$errors.model}
			aria-invalid={$form.model ? 'true' : undefined}
		>
			Model
		</LabelInput>
		<UploadImage bind:img={$form.image} defaultVal={getStorageUrl(`${$form.image}`)} />
		<LabelInput
			style="--padxy: 10px; --font: 15px; --height: 120px;"
			name="description"
			labelStyle="--width: 100%;"
			type="textarea"
			bind:value={$form.description}
			bind:error={$errors.description}
			aria-invalid={$form.description ? 'true' : undefined}
		>
			Description
		</LabelInput>
		<span class="Row--between w-100">
			<h3 class="w-100">Instances of this equipment</h3>
			<button
				type="button"
				class="FancyButton"
				data-icon={String.fromCharCode(57669)}
				style="--height: 34px; --width: auto --font: 15px;"
				on:click={() => {
					form.update(($form) => {
						const { instances } = $form;
						instances.push({
							name: `${$form.model} - ${instances.length + 1}`,
							description: '',
							status: EStatus.available,
							cost: '0'
						});

						$form.instances = instances;
						return $form;
					});
				}}
			>
				Add
			</button>
		</span>

		<ul class="Col--center w-100 gap-10">
			{#each $form.instances as item, i}
				<li class="Col--a-end gap-10 w-100">
					<LabelInput
						mandatory
						orient="row"
						style="--padxy: 10px; --width: 70%;"
						labelStyle="--width: 100%;"
						name={`instances[${i}].name`}
						type="text"
						bind:value={item.name}
						aria-invalid={item.name ? 'true' : undefined}
					>
						Name
					</LabelInput>
					<LabelInput
						mandatory
						orient="row"
						style="--padxy: 10px; --width: 70%;"
						labelStyle="--width: 100%;"
						name={`instances[${i}].cost`}
						type="number"
						bind:value={item.cost}
						aria-invalid={item.cost ? 'true' : undefined}
					>
						Cost
					</LabelInput>
					<div class="Row--between gap-10 w-100">
						<label for={`instances[${i}].status`} data-mandatory> Status </label>
						<select
							class="FancySelect"
							style="--width: 70%;"
							name={`instances[${i}].status`}
							bind:value={item.status}
						>
							<option value="" disabled selected> Select a Status </option>
							{#each Object.values(EStatus) as item}
								<option value={item}>{item}</option>
							{/each}
						</select>
					</div>
					<LabelInput
						orient="row"
						style="--padxy: 10px; --font: 15px; --height: 80px; --width: 70%;"
						name={`instances[${i}].description`}
						type="textarea"
						labelStyle="--width: 100%;"
						bind:value={item.description}
						aria-invalid={item.description ? 'true' : undefined}
					>
						Description
					</LabelInput>
					<button
						type="button"
						class="FancyButton"
						data-close
						data-icon={String.fromCharCode(59506)}
						style="--height: 34px; --width: auto --font: 15px;"
						on:click={() => {
							form.update(($form) => {
								let { instances } = $form;
								instances = instances.filter((_, index) => index !== i);
								$form.instances = instances;
								return $form;
							});
						}}
					>
						Remove
					</button>
				</li>
				<hr />
			{/each}
		</ul>
	</form>

	<div class="Row--j-end gap-10" slot="footer">
		<button
			class="FancyButton w-100"
			style="--height: 30px"
			data-type="black-outline"
			on:click={() => {
				modal = false;
				resetForm(form);
			}}
		>
			Cancel
		</button>
		<button
			type="submit"
			form="editEquipmentForm"
			class="FancyButton w-100"
			style="--height: 30px"
			data-type="black-fill"
			disabled={JSON.stringify($form) ===
				JSON.stringify((allEquipments || []).find((item) => item.id === $form.id))}
		>
			Update
		</button>
	</div>
</Pane>

<style lang="scss">
	label {
		font-size: 14px;
		line-height: 20px;
		font-weight: 500;
		flex-wrap: nowrap;
		color: rgb(104, 112, 118);
	}

	hr {
		width: 100%;
		border: none;
		border-bottom: 1px solid var(--border);
	}
</style>
