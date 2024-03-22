<script lang="ts">
  import type { getUserBookings } from '$db/User.db';
  import type { PageData } from './$types';
  import BookingViewPane from './Panes/BookingViewPane.svelte';

  export let data: PageData;

  $: selectedBooking = null as null | Awaited<ReturnType<typeof getUserBookings>>[0];
  $: bookingModal = false;
</script>

{#if selectedBooking}
  <BookingViewPane bind:modal={bookingModal} booking={selectedBooking} />
{/if}

<table class="FancyTable">
  <thead>
    <tr>
      <th> Booking ID </th>
      <th> Mentor </th>
      <th> Deadline </th>
      <th> Status </th>
      <th> </th>
    </tr>
  </thead>
  <tbody>
    {#if data.bookings && data.bookings.length > 0}
      {#each data.bookings as booking}
        <tr>
          <td> {booking.id} </td>
          <td> {booking.mentor} </td>
          <td>
            {new Date(booking.deadline).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
          </td>
          <td>
            <span class="Booking__status--{booking.status.toLowerCase()}">
              {booking.status}
            </span>
          </td>
          <td>
            <button
              class="CrispButton"
              on:click={() => {
                selectedBooking = booking;
                bookingModal = true;
              }}
            >
              View
            </button>
          </td>
        </tr>
      {/each}
    {:else}
      <tr>
        <td colspan="7">
          <i class="CrispMessage" data-type="info" data-format="box"> No bookings found </i>
        </td>
      </tr>
    {/if}
  </tbody>
  <tfoot>
    <tr>
      <td colspan="7"> Showing {data.bookings?.length ?? 0} result(s) </td>
    </tr>
  </tfoot>
</table>

<style lang="scss">
  .Booking {
    &__status {
      &--pending,
      &--approved,
      &--rejected,
      &--cancelled {
        @include box();
        @include make-flex($align: flex-start);
        padding: 6px 10px;
        border-radius: 5px;
      }

      &--pending {
        background-color: #f9d852;
        // color: #f9f9f9;
      }

      &--approved {
        background-color: #2ecc71;
        color: #f9f9f9;
      }

      &--rejected {
        background-color: #e74c3c;
        color: #f9f9f9;
      }

      &--cancelled {
        background-color: #7f8c8d;
        color: #f9f9f9;
      }
    }
  }
</style>
