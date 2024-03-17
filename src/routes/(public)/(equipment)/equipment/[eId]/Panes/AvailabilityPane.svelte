<script lang="ts">
	import Pane from '$components/Pane.svelte';
	import Calendar from '$components/Calendar.svelte';
	import type { CartItemSchema, ECategoriesSchema, EItemSchema, ESchema } from '$lib/schemas';
	import { superForm } from 'sveltekit-superforms/client';
	import type { SuperValidated } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import { getWeekdayDates, inverseWeekDaysEnum } from '$utils/WeekDayDates';
	import { addToast } from '$store/ToastStore';

	export let { modal, formStore, currentEquipment, instanceId, userId } = $$props as {
		modal: boolean;
		userId: string;
		instanceId: string;
		formStore: SuperValidated<CartItemSchema>;
		currentEquipment: (ESchema & { instances: EItemSchema[]; category: ECategoriesSchema }) | null;
	};

	$: equipmentId = currentEquipment?.id!;

	const { form, errors, enhance } = superForm(formStore, {
		id: 'cartItemForm',
		taintedMessage: null,
		dataType: 'json',
		onSubmit() {
			if (dateSelector) {
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
			}
		},
		onResult(event) {
			if (event.result.status === 200) {
				addToast({
					message: 'Item added to cart successfully'
				});
				modal = false;
			}
		}
	});

	$: dateSelector = null as Date | null;
	$: startTime = '';
	$: endTime = '';

	$: currentInstance = currentEquipment?.instances.find((item) => item.id === instanceId);
	$: maxOffset = currentInstance?.availability.maxOffset || 1;
	$: disableWeekDays = inverseWeekDaysEnum(currentInstance?.availability.repeat || []);
	$: blackout = getWeekdayDates(disableWeekDays, maxOffset);

	const defaultTimes = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
		.map((item) => [`${item}:00`, `${item}:30`])
		.flat();

	$: times = defaultTimes.filter(
		(item) =>
			(item >= currentInstance?.availability.starts! &&
				item <= currentInstance?.availability.ends!) ||
			(item >= currentInstance?.availability.starts! &&
				currentInstance?.availability.ends === '00:00') ||
			(item <= currentInstance?.availability.ends! &&
				currentInstance?.availability.starts === '00:00')
	);
</script>

<Pane className="CartItemPane" bind:open={modal} style="--paneWidth: 375px;">
	<p slot="header">Availability</p>
	<div class="CartItemPane__main" slot="free">
		<Calendar bind:value={dateSelector} {maxOffset} bind:blackout />
		<ul class="CartItemPane__legend">
			<li>
				<div class="CartItemPane__legend--unavailable" />
				<p>Not available</p>
			</li>
			<li>
				<div class="CartItemPane__legend--selected" />
				<p>Selected</p>
			</li>
		</ul>
		<i class="CrispMessage" data-type="info" data-format="box">
			Note: You can only book for a maximum of {maxOffset} month(s) from today.
		</i>
		<hr />
		<form use:enhance method="POST" id="cartItemForm" action="/equipment/[eId]?/add">
			<!-- <SuperDebug data={$form} /> -->
			<label class="CrispLabel" for="dateSelector">
				<span data-mandatory style="color: inherit;"> Date </span>
				<input
					disabled
					type="text"
					id="dateSelector"
					class="CrispInput"
					value={dateSelector?.toLocaleDateString('en-GB', {
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
	</div>
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

			& > form {
				gap: 15px;
				@include box(100%, auto);
				@include make-flex($just: flex-start);
			}

			& > hr {
				width: 90%;
				border: 0.5px solid var(--border);
			}
		}

		&__legend {
			list-style: none;
			@include make-flex($dir: row);
			@include box($height: auto);
			gap: 10px;

			& > li {
				gap: 10px;
				@include make-flex($dir: row, $just: flex-start);
				@include box($height: auto);

				& > div {
					width: 20px;
					height: 20px;
					border-radius: 5px;
				}
			}
			&--unavailable {
				background: #961105
					linear-gradient(
						135deg,
						rgba(255, 255, 255, 0.2) 25%,
						transparent 25%,
						transparent 50%,
						rgba(255, 255, 255, 0.2) 50%,
						rgba(255, 255, 255, 0.2) 75%,
						transparent 75%,
						transparent
					) !important;
				border-color: #961105 !important;
			}

			&--selected {
				background: #f59f16 none !important;
				border-color: #f59f16 !important;
			}
		}
	}
</style>
