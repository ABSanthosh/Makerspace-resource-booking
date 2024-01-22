<script lang="ts">
	import Pane from '$components/Pane.svelte';
	import Calendar from '$components/Calendar.svelte';
	import type { CartItemZSchema } from '$lib/schemas';
	import LabelInput from '$components/LabelInput.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import LabelSelect from '$components/LabelSelect.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let { modal, formStore, equipmentId, instanceId, userId } = $$props as {
		modal: boolean;
		userId: string;
		instanceId: string;
		equipmentId: string;
		formStore: SuperValidated<typeof CartItemZSchema>;
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
				start: new Date(
					dateSelector.getFullYear(),
					dateSelector.getMonth(),
					dateSelector.getDate(),
					parseInt(startTime.split(':')[0]),
					parseInt(startTime.split(':')[1])
				),
				end: new Date(
					dateSelector.getFullYear(),
					dateSelector.getMonth(),
					dateSelector.getDate(),
					parseInt(endTime.split(':')[0]),
					parseInt(endTime.split(':')[1])
				)
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
	$: startTime = times[0];
	$: endTime = times[0];
</script>

<Pane className="CartItemPane" bind:open={modal} style="--paneWidth: 450px;">
	<p slot="header">Availability</p>
	<form
		slot="free"
		use:enhance
		method="POST"
		action="?/add"
		id="cartItemForm"
		class="CartItemPane__main"
	>
		<SuperDebug data={$form} />

		<Calendar bind:value={dateSelector} />
		<hr />
		<LabelInput
			disabled
			labelStyle="--width: 100%;"
			value={dateSelector.toLocaleDateString('en-GB', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric'
			})}
		>
			Date
		</LabelInput>
		<LabelSelect labelStyle="--width: 100%;" bind:value={startTime} options={times}>
			Start Time
		</LabelSelect>
		<LabelSelect
			bind:value={endTime}
			labelStyle="--width: 100%;"
			options={times.filter((item) => item > startTime)}
		>
			End Time
		</LabelSelect>
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
