<script lang="ts">
  import type { getUserBookings } from '$db/Cart.db';
  import { bookingCost } from '$utils/BookingCost';
  import type { PageData } from './$types';
  import BookingViewPane from './Panes/BookingViewPane.svelte';

  export let data: PageData;

  type Booking = Awaited<ReturnType<typeof getUserBookings>>[0];

  $: selectedBooking = null as null | Booking;
  $: bookingModal = false;
</script>

{#if selectedBooking}
  <BookingViewPane
    bind:modal={bookingModal}
    booking={selectedBooking}
    bind:formStore={data.bookingDeleteForm}
    bind:updateFormStore={data.bookingUpdateForm}
  />
{/if}

<table class="FancyTable">
  <thead>
    <tr>
      <th> Booking ID </th>
      <th> Mentor </th>
      <th> Deadline </th>
      <th> Booking Status </th>
      <th> Payment Status </th>
      <th> </th>
    </tr>
  </thead>
  <tbody>
    {#if data.bookings && data.bookings.length > 0}
      {#each data.bookings.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) as booking}
        <tr>
          <td>
            <pre> {booking.id} </pre>
          </td>
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
            <span class="Booking__status--{booking.paymentStatus.toLowerCase()}">
              {booking.paymentStatus}
            </span>
          </td>
          <td>
            <button
              class="CrispButton"
              on:click={() => {
                data.bookingUpdateForm.data = {
                  bookingId: booking.id,
                  status: booking.status,
                  paymentStatus: booking.paymentStatus,
                  paymentId: booking.paymentId ?? ''
                };
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
        <td colspan="6">
          <i class="CrispMessage" data-type="info" data-format="box"> No bookings found </i>
        </td>
      </tr>
    {/if}
  </tbody>
  <tfoot>
    <tr>
      <td colspan="6"> Showing {data.bookings?.length ?? 0} result(s) </td>
    </tr>
  </tfoot>
</table>

<style lang="scss">
  .Booking {
    &__status {
      &--pending,
      &--approved,
      &--rejected,
      &--cancelled,
      &--verification,
      &--failed,
      &--success {
        @include box();
        @include make-flex($align: flex-start);
        padding: 6px 10px;
        border-radius: 5px;
      }

      &--pending,
      &--verification {
        background-color: #f9d852;
        // color: #f9f9f9;
      }

      &--approved,
      &--success {
        background-color: #2ecc71;
        color: #f9f9f9;
      }

      &--failed,
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
