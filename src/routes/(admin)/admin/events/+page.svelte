<script lang="ts">
	import { CartItemZSchema, type EventSchema } from "$lib/schemas";
	import type { Writable } from "svelte/store";
	import type { PageData } from "./$types";
import EventPane from "./EventPane.svelte";

export let data: PageData;

  $: ({
    upsertEventForm,
    allEvent,
  } = data );

  const resetForm = (form: Writable<EventSchema>) => {
		form.set({
      name: "",
      shortDescription: "",
      description: "",
      image: "",
      status: "",
      date: new Date(),
		});
	};

  $: eventModal = false;
  $: editEventId = '';

  $: eventSearch = '';
  $: searchEvent = allEvent?.filter((item) =>
		item.name.toLowerCase().includes(eventSearch.toLowerCase())
	);
</script>

{#if eventModal}
  <EventPane {resetForm} bind:modal={eventModal} bind:formStore={upsertEventForm} />
{/if}

<main class="AdminEvent">
  <header>
    <input type="search" class="CrispInput" bind:value={eventSearch} placeholder="Search Events" />
    <span class="Row--center gap-15">

			<button
				class="CrispButton"
				data-type="dark-blue"
				on:click={() => {
					eventModal = !eventModal;
					if (upsertEventForm) {
						upsertEventForm.data = {
              name: "",
              shortDescription: "",
              description: "",
              image: "",
              status: "",
              date: new Date(),
						};
					}
				}}
			>
				Add equipment
			</button>
		</span>
  </header>
  <div class="AdminEvent__content">
    <table class="FancyTable">
      <thead>
        <tr>
          <th> Event Name </th>
          <th> Date </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#if searchEvent && searchEvent.length > 0}
          {#each searchEvent as event}
            <tr>
              <td> {event.name} </td>
              <td> {event.date} </td>
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
                            date: new Date(event.date),
                            description: event.description,
                            name: event.name,
                            id: event.id,
                            shortDescription: event.shortDescription,
                            status: true,
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