<script lang="ts">
	import LabelInput from '$components/LabelInput.svelte';
	import Pane from '$components/Pane.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import type { EquipmentItemSchema, NewEquipmentSchema, newEquipmentSchema } from '$lib/schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { Writable } from 'svelte/store';
	export let data: PageData;

	console.log(data);
	$: addEquipmentModal = false;
	$: editEquipmentModal = false;
	$: instances = [] as EquipmentItemSchema[];
	const {
		form: newForm,
		errors,
		enhance
	} = superForm(data.newEquipmentForm, {
		id: 'newEquipmentForm',
		dataType: 'json',
		onSubmit: () => {
			newForm.update(
				($newForm) => {
					$newForm.equipment = instances;
					return $newForm;
				},
				{ taint: false }
			);
		},
		onResult(event) {
			if (event.result.status === 200) {
				instances = [];
				addEquipmentModal = false;
				resetForm(newForm);
			}
		}
	});

	const resetForm = (form: Writable<NewEquipmentSchema>) => {
		form.set({
			name: '',
			model: '',
			image: '',
			description: '',
			equipment: []
		});
		// form.name = '';
		// form.model = '';
		// form.image = '';
		// form.description = '';
		// form.equipment = [];
		instances = [];
	};

	const {
		form: editForm,
		errors: editErrors,
		enhance: editEnhance
	} = superForm(data.editEquipmentForm as SuperValidated<typeof newEquipmentSchema>, {
		id: 'editEquipmentForm',
		dataType: 'json',
		onSubmit: () => {
			editForm.update(
				($editForm) => {
					$editForm.equipment = instances;
					return $editForm;
				},
				{ taint: false }
			);
		},
		onResult(event) {
			if (event.result.status === 200) {
				instances = [];
				editEquipmentModal = false;
				resetForm(newForm);
			}
		}
	});
</script>

<Pane bind:open={addEquipmentModal} style="--paneWidth: 450px;" on:close={() => resetForm(newForm)}>
	<div class="AddEModal">
		<h2>Add Equipment</h2>
		<form class="Col--center gap-10 w-100" action="?/add" method="POST" use:enhance>
			<LabelInput
				mandatory
				noFocus
				style="--padxy: 10px; --font: 15px; --height: 34px;"
				name="name"
				type="text"
				bind:value={$newForm.name}
				bind:error={$errors.name}
				aria-invalid={$newForm.name ? 'true' : undefined}
			>
				Name
			</LabelInput>
			<LabelInput
				mandatory
				noFocus
				style="--padxy: 10px; --font: 15px; --height: 34px;"
				name="model"
				type="text"
				bind:value={$newForm.model}
				bind:error={$errors.model}
				aria-invalid={$newForm.model ? 'true' : undefined}
			>
				Model
			</LabelInput>
			<LabelInput
				noFocus
				style="--padxy: 10px; --font: 15px; --height: 34px;"
				name="image"
				type="text"
				bind:value={$newForm.image}
				bind:error={$errors.image}
				aria-invalid={$newForm.image ? 'true' : undefined}
			>
				Image URL
			</LabelInput>

			<LabelInput
				noFocus
				style="--padxy: 10px; --font: 15px; --height: 120px;"
				name="description"
				type="textarea"
				bind:value={$newForm.description}
				bind:error={$errors.description}
				aria-invalid={$newForm.description ? 'true' : undefined}
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
								name: `${$newForm.model} - ${instances.length + 1}`,
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

<Pane
	bind:open={editEquipmentModal}
	style="--paneWidth: 450px;"
	on:close={() => resetForm(editForm)}
>
	<div class="AddEModal">
		<h2>Edit Equipment</h2>
		<form class="Col--center gap-10 w-100" action="?/edit" method="POST" use:editEnhance>
			<LabelInput
				mandatory
				noFocus
				style="--padxy: 10px; --font: 15px; --height: 34px;"
				name="name"
				type="text"
				bind:value={$editForm.name}
				bind:error={$editErrors.name}
				aria-invalid={$editForm.name ? 'true' : undefined}
			>
				Name
			</LabelInput>
			<LabelInput
				mandatory
				noFocus
				style="--padxy: 10px; --font: 15px; --height: 34px;"
				name="model"
				type="text"
				bind:value={$editForm.model}
				bind:error={$editErrors.model}
				aria-invalid={$editForm.model ? 'true' : undefined}
			>
				Model
			</LabelInput>
			<LabelInput
				noFocus
				style="--padxy: 10px; --font: 15px; --height: 34px;"
				name="image"
				type="text"
				bind:value={$editForm.image}
				bind:error={$editErrors.image}
				aria-invalid={$editForm.image ? 'true' : undefined}
			>
				Image URL
			</LabelInput>

			<LabelInput
				noFocus
				style="--padxy: 10px; --font: 15px; --height: 120px;"
				name="description"
				type="textarea"
				bind:value={$editForm.description}
				bind:error={$editErrors.description}
				aria-invalid={$editForm.description ? 'true' : undefined}
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
								name: `${$editForm.model} - ${instances.length + 1}`,
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
			<button
				class="FancyButton w-100"
				type="submit"
				disabled={JSON.stringify($editForm) ===
					JSON.stringify((data.allEquipment || []).find((item) => item.id === $editForm.id))}
			>
				Update
			</button>
		</form>
	</div>
</Pane>

<main class="AdminEquipment">
	<button class="FancyButton" on:click={() => (addEquipmentModal = !addEquipmentModal)}>
		Add equipment
	</button>
	<div class="AdminEquipment__content">
		{#if data.allEquipment}
			{#each data.allEquipment as item}
				<div class="AdminEquipment__card">
					<img src={item.image} alt={item.name} />
					<h2 class="w-100">{item.name}</h2>
					<p class="w-100">{item.model}</p>
					<button
						class="FancyButton"
						data-icon={String.fromCharCode(58313)}
						style="--height: 34px; --width: auto --font: 15px;"
						on:click={() => {
							editForm.update(($editForm) => {
								$editForm.name = item.name;
								$editForm.model = item.model;
								$editForm.image = item.image ?? '';
								$editForm.description = item.description ?? '';
								$editForm.equipment = [];
								$editForm.id = item.id;
								// @ts-ignore
								instances = item.items ?? [];
								return $editForm;
							});
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
		}
	}
</style>
