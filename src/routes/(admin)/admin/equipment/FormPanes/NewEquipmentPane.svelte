<script lang="ts">
	import { EStatus } from '@prisma/client';
	import Pane from '$components/Pane.svelte';
	import type { Writable } from 'svelte/store';
	import type { ECategories } from '@prisma/client';
	import type { ESchema, EZodSchema } from '$lib/schemas';
	import { superForm } from 'sveltekit-superforms/client';
	import UploadImage from '$components/UploadImage.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let { modal, formStore, resetForm, eCategories } = $$props as {
		modal: boolean;
		formStore: SuperValidated<typeof EZodSchema>;
		resetForm: (form: Writable<ESchema>) => void;
		eCategories: ECategories[];
	};

	const { form, errors, enhance } = superForm(formStore, {
		id: 'newEquipmentForm',
		dataType: 'json',
		onResult(event) {
			if (event.result.status === 200) {
				modal = false;
				resetForm(form);
			}
		},
		taintedMessage: null
	});

	$: console.log($errors);
</script>

<Pane bind:open={modal} style="--paneWidth: 450px;" on:close={() => resetForm(form)}>
	<p slot="header">Add Equipment</p>
	<svelte:fragment slot="main">
		<form
			use:enhance
			method="POST"
			action="/admin/equipment?/add"
			id="newEquipmentForm"
			enctype="multipart/form-data"
			class="Col--center gap-10 w-100"
		>
			<SuperDebug data={$form} />
			<select
				class="CrispSelect"
				style="--crp-select-width: 100%;"
				bind:value={$form.eCategoriesId}
			>
				<option value="" disabled selected>Select a Category</option>
				{#each eCategories as item}
					<option value={item.id}>{item.name}</option>
				{/each}
			</select>

			<label class="CrispLabel" for="name">
				<span data-mandatory style="color: inherit;"> Name </span>
				<input class="CrispInput" type="text" name="name" id="name" bind:value={$form.name} />
				{#if $errors.name}
					<ul class="CrispMessageList w-100" data-type="error">
						{#each $errors.name as error}
							<li class="CrispMessageList__item">{error}</li>
						{/each}
					</ul>
				{/if}
			</label>

			<label class="CrispLabel" for="model">
				<span data-mandatory style="color: inherit;"> Model </span>
				<input class="CrispInput" type="text" name="model" id="model" bind:value={$form.model} />
				{#if $errors.model}
					<ul class="CrispMessageList w-100" data-type="error">
						{#each $errors.model as error}
							<li class="CrispMessageList__item">{error}</li>
						{/each}
					</ul>
				{/if}
			</label>
			<UploadImage name="eImage" />
			<label class="CrispLabel" for="description">
				<span style="color: inherit;"> Description </span>
				<textarea
					class="CrispInput"
					name="description"
					data-type="text-area"
					id="description"
					bind:value={$form.description}
				/>
				{#if $errors.description}
					<ul class="CrispMessageList w-100" data-type="error">
						{#each $errors.description as error}
							<li class="CrispMessageList__item">{error}</li>
						{/each}
					</ul>
				{/if}
			</label>
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
						<label
							class="CrispLabel"
							data-align="center"
							data-direction="row"
							for={`instances[${i}].name`}
							style="justify-content: space-between;"
						>
							<span data-mandatory style="color: inherit;"> Name </span>
							<input
								type="text"
								class="CrispInput"
								bind:value={item.name}
								name={`instances[${i}].name`}
								style="--crp-input-width: 70%;"
							/>
							{#if $errors.instances && $errors.instances[i] && $errors.instances[i].name}
								<ul class="CrispMessageList w-100" data-type="error">
									{#each $errors.instances[i].name ?? [] as error}
										<li class="CrispMessageList__item">{error}</li>
									{/each}
								</ul>
							{/if}
						</label>

						<label
							class="CrispLabel"
							data-align="center"
							data-direction="row"
							for={`instances[${i}].cost`}
							style="justify-content: space-between;"
						>
							<span data-mandatory style="color: inherit;"> Cost </span>
							<input
								type="number"
								class="CrispInput"
								bind:value={item.cost}
								name={`instances[${i}].cost`}
								style="--crp-input-width: 70%;"
							/>
							{#if $errors.instances && $errors.instances[i] && $errors.instances[i].cost}
								<ul class="CrispMessageList w-100" data-type="error">
									{#each $errors.instances[i].cost ?? [] as error}
										<li class="CrispMessageList__item">{error}</li>
									{/each}
								</ul>
							{/if}
						</label>

						<label
							class="CrispLabel"
							data-align="center"
							data-direction="row"
							for={`instances[${i}].status`}
							style="justify-content: space-between;"
						>
							<span data-mandatory style="color: inherit;"> Status </span>
							<select
								class="CrispSelect"
								bind:value={item.status}
								name={`instances[${i}].status`}
								style="--crp-select-width: 70%;"
							>
								<option value="" disabled selected>Select a Status</option>
								{#each Object.values(EStatus) as item}
									<option value={item}>{item}</option>
								{/each}
							</select>
							{#if $errors.instances && $errors.instances[i] && $errors.instances[i].status}
								<ul class="CrispMessageList w-100" data-type="error">
									{#each $errors.instances[i].status ?? [] as error}
										<li class="CrispMessageList__item">{error}</li>
									{/each}
								</ul>
							{/if}
						</label>

						<label
							class="CrispLabel"
							data-align="center"
							data-direction="row"
							for={`instances[${i}].description`}
							style="justify-content: space-between;"
						>
							<span style="color: inherit;"> Description </span>
							<textarea
								class="CrispInput"
								data-type="text-area"
								bind:value={item.description}
								style="--crp-input-width: 70%;"
								name={`instances[${i}].description`}
							/>
							{#if $errors.instances && $errors.instances[i] && $errors.instances[i].description}
								<ul class="CrispMessageList w-100" data-type="error">
									{#each $errors.instances[i].description ?? [] as error}
										<li class="CrispMessageList__item">{error}</li>
									{/each}
								</ul>
							{/if}
						</label>

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
	</svelte:fragment>
	<div slot="footer">
		<button
			form="newEquipmentForm"
			class="FancyButton w-100"
			style="--height: 30px"
			data-type="black-fill"
			type="submit"
		>
			submit
		</button>
	</div>
</Pane>

<style lang="scss">
	hr {
		width: 100%;
		border: none;
		border-bottom: 1px solid var(--border);
	}
</style>
