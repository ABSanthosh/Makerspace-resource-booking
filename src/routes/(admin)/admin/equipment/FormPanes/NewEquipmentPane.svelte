<script lang="ts">
	import LabelInput from '$components/LabelInput.svelte';
	import Pane from '$components/Pane.svelte';
	import type { Writable } from 'svelte/store';
	import type { ESchema, EItemSchema, EZodSchema } from '$lib/schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import type { ECategories } from '@prisma/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let { modal, formStore, instances, resetForm, eCategories } = $$props as {
		modal: boolean;
		instances: EItemSchema[];
		formStore: SuperValidated<typeof EZodSchema>;
		resetForm: (form: Writable<ESchema>) => void;
		eCategories: ECategories[];
	};

	const { form, errors, enhance } = superForm(formStore, {
		id: 'newEquipmentForm',
		dataType: 'json',
		onSubmit: () => {
			form.update(
				($form) => {
					$form.instances = instances;
					return $form;
				},
				{ taint: false }
			);
		},
		onResult(event) {
			if (event.result.status === 200) {
				instances = [];
				modal = false;
				resetForm(form);
			}
		}
	});
</script>

<Pane bind:open={modal} style="--paneWidth: 450px;" on:close={() => resetForm(form)}>
	<!-- <SuperDebug data={$form} /> -->
	<div class="AddEModal">
		<h2>Add Equipment</h2>
		<form class="Col--center gap-10 w-100" action="?/add" method="POST" use:enhance>
			<select class="FancySelect" bind:value={$form.eCategoriesId}>
				<option value="" disabled selected>Select a Category</option>
				{#each eCategories as item}
					<option value={item.id}>{item.name}</option>
				{/each}
			</select>
			<LabelInput
				mandatory
				noFocus
				style="--padxy: 10px; --font: 15px; --height: 34px;"
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
				noFocus
				style="--padxy: 10px; --font: 15px; --height: 34px;"
				name="model"
				type="text"
				bind:value={$form.model}
				bind:error={$errors.model}
				aria-invalid={$form.model ? 'true' : undefined}
			>
				Model
			</LabelInput>
			<LabelInput
				noFocus
				style="--padxy: 10px; --font: 15px; --height: 34px;"
				name="image"
				type="text"
				bind:value={$form.image}
				bind:error={$errors.image}
				aria-invalid={$form.image ? 'true' : undefined}
			>
				Image URL
			</LabelInput>

			<LabelInput
				noFocus
				style="--padxy: 10px; --font: 15px; --height: 120px;"
				name="description"
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
						instances = [
							...instances,
							{
								name: `${$form.model} - ${instances.length + 1}`,
								description: ''
							}
						];
					}}
				>
					Add
				</button>
			</span>
			<ul class="Col--center w-100 gap-10">
				{#each instances as item, i}
					<li class="Col--a-end gap-10 w-100">
						<LabelInput
							mandatory
							noFocus
							orient="row"
							style="--padxy: 10px; --font: 15px; --height: 34px; --width: 70%;"
							name={`instances[${i}].name`}
							type="text"
							bind:value={item.name}
							aria-invalid={item.name ? 'true' : undefined}
						>
							Name
						</LabelInput>
						<LabelInput
							noFocus
							orient="row"
							style="--padxy: 10px; --font: 15px; --height: 80px; --width: 70%;"
							name={`instances[${i}].description`}
							type="textarea"
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
								instances = instances.filter((_, index) => index !== i);
							}}
						>
							Remove
						</button>
					</li>
				{/each}
			</ul>
			<button class="FancyButton w-100" type="submit"> submit </button>
		</form>
	</div>
</Pane>

<style lang="scss">
	.AddEModal {
		gap: 20px;
		@include box($height: auto);
		padding: 20px;
		@include make-flex($just: flex-start);
		& > h2 {
			@include box(100%, auto);
			font-size: 35px;
			font-weight: 600;
		}

		& > form {
			h3 {
				font-size: 18px;
				font-weight: 600;
			}

			& > select {
				width: 100%;
			}
		}
	}
</style>
