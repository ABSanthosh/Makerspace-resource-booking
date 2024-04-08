<script lang="ts">
	import { type EventSchema } from '$lib/schemas';
	import { get, type Writable } from 'svelte/store';
	import type { PageData } from './$types';
	import EventPane from './Panes/EventPane.svelte';

	export let data: PageData;

	$: ({ upsertEventForm, allEvents } = data);

	const resetForm = (form: Writable<EventSchema>) => {
		form.set({
			title: '',
			previewDesc: '',
			desc: '',
			image: '',
			startTime: new Date(),
			endTime: new Date(),
			status: 'UPCOMING',
			venue: '',
			venueLink: '',
			userId: ''
		});
	};

	$: eventModal = false;
	$: editEventId = '';

	$: eventSearch = '';
	$: searchEvent = allEvents?.filter((item) =>
		item.title.toLowerCase().includes(eventSearch.toLowerCase())
	);

	$: if (!eventModal) {
		upsertEventForm.data = {} as EventSchema;
	}
</script>

{#if eventModal}
	<EventPane {resetForm} bind:modal={eventModal} bind:formStore={upsertEventForm} />
{/if}

<main class="AdminEvent">
	<header>
		<input type="search" class="CrispInput" bind:value={eventSearch} placeholder="Search Events" />
		<span class="Row--center gap-15">
			<button class="CrispButton" data-type="dark-blue" on:click={() => (eventModal = !eventModal)}>
				Add Event
			</button>
		</span>
	</header>
	<div class="AdminEvent__content">
		<table class="FancyTable">
			<thead>
				<tr>
					<th> Event Name </th>
					<th> Start time </th>
					<th> End time </th>
					<th> </th>
				</tr>
			</thead>
			<tbody>
				{#if searchEvent && searchEvent.length > 0}
					{#each searchEvent as event}
						<tr>
							<td> {event.title} </td>
							<td>
								{new Date(event.startTime).toLocaleString('en-US', {
									month: 'short',
									day: 'numeric',
									year: 'numeric',
									hour12: true,
									hour: '2-digit',
									minute: '2-digit'
								})}
							</td>
							<td>
								{new Date(event.endTime).toLocaleString('en-US', {
									month: 'short',
									day: 'numeric',
									year: 'numeric',
									hour12: true,
									hour: '2-digit',
									minute: '2-digit'
								})}
							</td>
							<td>
								<button
									class="CrispButton"
									style="--crp-button-height: 24px; 
										--crp-button-width: auto; 
										--crp-button-padding-left: 6px; 
										--crp-button-padding-right: 6px;"
									on:click={() => {
										if (upsertEventForm) {
											upsertEventForm.data = {
												...event,
												// Doc: We have to remove the ?cache from the image URL so it won't be cycled
												// the name of the image file when we update the image
												image: event.image.split('?')[0],
												venueLink: event.venueLink || ""
											};
										}
										eventModal = true;
										editEventId = '';
									}}
								>
									Edit
								</button>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</main>

<style lang="scss">
	.AdminEvent {
		gap: 24px;
		padding: 24px;
		@include box();
		@include make-flex($just: flex-start);

		& > header {
			gap: 15px;
			@include box($height: auto);
			@include make-flex($dir: row, $just: space-between);

			@include respondAt(645px) {
				align-items: flex-end;
				flex-direction: column;
			}
			& > input {
				--crp-input-width: 270px;

				@include respondAt(645px) {
					--crp-input-width: 100%;
				}
			}
		}

		&__content {
			@include box();
			overflow: auto;
			padding-right: 5px;
			scrollbar-gutter: stable;
			max-height: calc(100vh - 112px);

			&::-webkit-scrollbar {
				width: 6px;
			}
		}
	}
</style>
