<script lang="ts">
	import LabelInput from '$components/LabelInput.svelte';
	import Pane from '$components/Pane.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	// import { enhance } from '$app/forms';

	export let data: PageData;
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import type { EquipmentItemSchema } from '$lib/schemas';

	// console.log(data);
	$: addEquipmentModal = true;

	$: instances = [] as EquipmentItemSchema[];
	const {
		form: newForm,
		errors,
		enhance
	} = superForm(data.newEquipmentForm, {
		dataType: 'json',
		onSubmit: () => {
			newForm.update(
				($newForm) => {
					$newForm.equipment = instances;
					return $newForm;
				},
				{ taint: false }
			);
		}
	});
</script>

<button on:click={() => (addEquipmentModal = !addEquipmentModal)}>Open</button>
<Pane
	bind:open={addEquipmentModal}
	style="--paneWidth: 450px;"
	on:close={() => {
		$newForm.name = '';
		$newForm.model = '';
		$newForm.image = '';
		$newForm.description = '';
		$newForm.equipment = [];
	}}
>
	<div class="AddEModal">
		<h2>Add Equipment</h2>
		<form class="Col--center gap-10 w-100" action="?/add" method="POST" use:enhance>
			<!-- <SuperDebug data={$newForm} /> -->

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
								name: `${$newForm.name} ${instances.length + 1}`,
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
		}
	}
</style>
