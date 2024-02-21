<script lang="ts">
	import Pane from '$components/Pane.svelte';
	import Calendar from '$components/Calendar.svelte';
	import type { CartItemSchema } from '$lib/schemas';
	import { superForm } from 'sveltekit-superforms/client';
	import type { SuperValidated } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let { modal, formStore, equipmentId, instanceId, userId } = $$props as {
		modal: boolean;
		userId: string;
		instanceId: string;
		equipmentId: string;
		formStore: SuperValidated<CartItemSchema>;
	};

	const { form, errors, enhance } = superForm(formStore, {
		id: 'cartItemForm',
		taintedMessage: null,
		dataType: 'json',
		onSubmit() {
			form.set({
				...$form,
				userId,
				instanceId,
				equipmentId,
				// @ts-ignore
				start:
					startTime !== ''
						? new Date(
								dateSelector.getFullYear(),
								dateSelector.getMonth(),
								dateSelector.getDate(),
								parseInt(startTime.split(':')[0]),
								parseInt(startTime.split(':')[1])
							)
						: null,
				// @ts-ignore
				end:
					endTime !== ''
						? new Date(
								dateSelector.getFullYear(),
								dateSelector.getMonth(),
								dateSelector.getDate(),
								parseInt(endTime.split(':')[0]),
								parseInt(endTime.split(':')[1])
							)
						: null
			});
		},
		onResult(event) {
			if (event.result.status === 200) {
				modal = false;
			}
		}
	});

	const times = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
		.map((item) => [`${item}:00`, `${item}:30`])
		.flat();

	$: dateSelector = new Date();
	$: startTime = '';
	$: endTime = '';
</script>

<Pane className="CartItemPane" bind:open={modal} style="--paneWidth: 450px;">
	<p slot="header">Availability</p>
	<form
		slot="free"
		use:enhance
		method="POST"
		id="cartItemForm"
		class="CartItemPane__main"
		action="/equipment/[eId]?/add"
	>
		<!-- <SuperDebug data={$form} /> -->

		<Calendar bind:value={dateSelector} />
		<hr />
		<label class="CrispLabel" for="dateSelector">
			<span data-mandatory style="color: inherit;"> Date </span>
			<input
				disabled
				type="text"
				id="dateSelector"
				class="CrispInput"
				value={dateSelector.toLocaleDateString('en-GB', {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric'
				})}
			/>
		</label>

		<label class="CrispLabel" for="startTime">
			<span data-mandatory style="color: inherit;"> Start Time </span>
			<select class="CrispSelect" style="--crp-select-width: 100%;" bind:value={startTime}>
				<option value="" disabled selected> Select a start time </option>
				{#each times.filter((item) => (endTime !== '' ? item < endTime : true)) as item}
					<option value={item}>{item}</option>
				{/each}
			</select>
			{#if $errors.start}
				<ul class="CrispMessageList" data-type="error">
					{#each $errors.start as error}
						<li class="CrispMessageList__item">{error}</li>
					{/each}
				</ul>
			{/if}
		</label>

		<label class="CrispLabel" for="endTime">
			<span data-mandatory style="color: inherit;"> End Time </span>
			<select class="CrispSelect" style="--crp-select-width: 100%;" bind:value={endTime}>
				<option value="" disabled selected> Select an end time </option>
				{#each times.filter((item) => item > startTime) as item}
					<option value={item}>{item}</option>
				{/each}
			</select>
			{#if $errors.end}
				<ul class="CrispMessageList" data-type="error">
					{#each $errors.end as error}
						<li class="CrispMessageList__item">{error}</li>
					{/each}
				</ul>
			{/if}
		</label>
	</form>
	<div class="Row--j-end gap-10" slot="footer">
		<button class="FancyButton" data-type="black-outline" on:click={() => (modal = false)}>
			Close
		</button>
		<button class="FancyButton" data-type="black-fill" form="cartItemForm"> Add to cart </button>
	</div>
</Pane>

<style lang="scss">
	.CartItemPane {
		&__main {
			gap: 15px;
			flex: 1 1 0%;
			padding: 24px;
			overflow-y: auto;
			@include box(100%, auto);
			@include make-flex($just: flex-start);

			& > hr {
				width: 90%;
				border: 0.5px solid var(--border);
			}
		}
	}
</style>
