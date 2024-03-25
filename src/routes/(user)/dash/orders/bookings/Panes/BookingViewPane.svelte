<script lang="ts">
  import Pane from '$components/Pane.svelte';
  import { addToast } from '$store/ToastStore';
  import type { getUserBookings } from '$db/Cart.db';
  import type { BookingCancelSchema } from '$lib/schemas';
  import { superForm, type SuperValidated } from 'sveltekit-superforms';
  import { BookingStatus } from '@prisma/client';

  export let { modal, booking, formStore } = $$props as {
    modal: boolean;
    booking: Awaited<ReturnType<typeof getUserBookings>>[0];
    formStore: SuperValidated<BookingCancelSchema>;
  };

  const { form, enhance } = superForm(formStore, {
    dataType: 'json',
    onSubmit() {
      form.set({
        bookingId: booking.id
      });
    },
    onResult(event) {
      modal = false;
      if (event.result.status === 400) {
        addToast({ message: 'Booking could not be cancelled', type: 'danger' });
      } else if (event.result.status === 200) {
        addToast({ message: 'Booking cancelled successfully', type: 'success' });
      }
    }
  });
</script>

<Pane bind:open={modal} style="--paneWidth: 450px;" on:close={() => (modal = false)}>
  <p slot="header">Booking</p>
  <svelte:fragment slot="main">
    <div class="Col--center gap-15">
      <label for="mentor" class="CrispLabel">
        <span style="color: inherit;" data-mandatory> Mentor </span>
        <input
          id="mentor"
          type="text"
          name="mentor"
          disabled
          class="CrispInput"
          bind:value={booking.mentor}
        />
      </label>
      <label for="description" class="CrispLabel">
        <span style="color: inherit;" data-mandatory> Description </span>
        <textarea
          id="description"
          name="description"
          class="CrispInput"
          data-type="text-area"
          disabled
          bind:value={booking.description}
        />
      </label>
      <label for="deadline" class="CrispLabel">
        <span style="color: inherit;" data-mandatory> Deadline </span>
        <input
          id="deadline"
          type="date"
          name="deadline"
          disabled
          class="CrispInput"
          value={new Date(booking.deadline).toISOString().split('T')[0]}
        />
      </label>
      <label for="instance" class="CrispLabel" style="overflow-x: auto; padding-bottom: 10px;">
        <span style="color: inherit;"> Instances </span>
        <table class="FancyTable">
          <thead>
            <tr>
              <th> Name </th>
              <th> Slot Date </th>
              <th> Timing </th>
              <th> Cost </th>
            </tr>
          </thead>
          <tbody>
            {#if booking.items.length >= 0}
              {#each booking.items as item}
                <tr>
                  <td>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="/equipment/{item.instance.equipmentId}"
                    >
                      {item.instance.name}
                    </a>
                  </td>
                  <td>
                    {new Date(item.start).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td>
                    {new Date(item.start).toLocaleString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                    })}
                    {' '}-{' '}
                    {new Date(item.end).toLocaleString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                    })}
                  </td>
                  <td> {item.instance.cost} </td>
                </tr>
              {/each}
            {:else}
              <tr>
                <td colspan="4">
                  <i class="CrispMessage" data-type="info" data-format="box"> No items found </i>
                </td>
              </tr>
            {/if}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4">
                Showing {booking.items.length} result(s)
              </td>
            </tr>
          </tfoot>
        </table>
      </label>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="footer">
    {#if booking.status === 'PENDING'}
      <form action="/dash/orders/bookings?/cancel" method="POST" use:enhance>
        <button type="submit" class="CrispButton" data-type="danger"> Cancel </button>
      </form>
    {/if}
  </svelte:fragment>
</Pane>
