<script lang="ts">
  import Pane from '$components/Pane.svelte';
  import { addToast } from '$store/ToastStore';
  import type { getUserBookings } from '$db/Cart.db';
  import type { BookingCancelSchema, BookingUpdateSchema } from '$lib/schemas';
  import { superForm, type SuperValidated } from 'sveltekit-superforms';
  import { BookingStatus, PaymentStatus } from '@prisma/client';
  import { bookingCost } from '$utils/BookingCost';

  export let { modal, booking, formStore, updateFormStore } = $$props as {
    modal: boolean;
    booking: Awaited<ReturnType<typeof getUserBookings>>[0];
    formStore: SuperValidated<BookingCancelSchema>;
    updateFormStore: SuperValidated<BookingUpdateSchema>;
  };

  const { form: deleteForm, enhance: deleteEnhance } = superForm(formStore, {
    id: 'deleteForm',
    dataType: 'json',
    onSubmit() {
      deleteForm.set({
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

  const { form: updateForm, enhance: updateEnhance } = superForm(updateFormStore, {
    id: 'updateForm',
    dataType: 'json',
    onSubmit() {
      updateForm.set({
        ...$updateForm,
        bookingId: booking.id,
        paymentStatus: PaymentStatus.VERIFICATION
      });
    },
    onResult(event) {
      modal = false;
      if (event.result.status === 400) {
        addToast({ message: 'Booking could not be updated', type: 'danger' });
      } else if (event.result.status === 200) {
        addToast({ message: 'Booking updated successfully', type: 'success' });
      }
    }
  });

  const defaultPaymentId = booking.paymentId || '';

  // @ts-ignore
  $: bookingItemsCost = bookingCost(booking.items);
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
      <label for="cost" class="CrispLabel">
        <span style="color: inherit;"> Cost </span>
        <input
          disabled
          readonly
          id="cost"
          type="text"
          name="cost"
          class="CrispInput"
          value={new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
          }).format(bookingItemsCost)}
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
            {#if booking.items.length > 0}
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

      <label for="status" class="CrispLabel" style="overflow-x: auto; padding-bottom: 10px;">
        <span style="color: inherit;" data-mandatory> Status </span>
        <select
          disabled
          id="status"
          name="status"
          class="CrispSelect w-100"
          bind:value={booking.status}
          required
        >
          <!-- <option value="" disabled selected> Select Status </option> -->
          {#each Object.values(BookingStatus) as item}
            <option value={item} selected={item === booking.status ? true : undefined}>
              {item}
            </option>
          {/each}
        </select>
      </label>

      <label for="paymentId" class="CrispLabel">
        <span style="color: inherit;" data-mandatory> paymentId </span>
        <input
          id="paymentId"
          name="paymentId"
          class="CrispInput"
          type="text"
          disabled={defaultPaymentId !== ''}
          readonly={defaultPaymentId !== ''}
          bind:value={$updateForm.paymentId}
        />
      </label>
      {#if booking.status !== BookingStatus.CANCELLED && booking.adminNotes}
        <label for="adminNotes" class="CrispLabel">
          <span style="color: inherit;"> Admin Notes </span>
          <textarea
            disabled
            id="adminNotes"
            name="adminNotes"
            class="CrispInput"
            data-type="text-area"
            bind:value={booking.adminNotes}
          />
        </label>
      {/if}
    </div>
  </svelte:fragment>
  <svelte:fragment slot="footer">
    <div class="w-100 Row--j-end gap-10">
      {#if booking.status === 'PENDING'}
        <form
          action="/dash/orders/bookings?/cancel"
          method="POST"
          use:deleteEnhance
          id="cancelForm"
        >
          <button type="submit" class="CrispButton" data-type="danger"> Cancel </button>
        </form>
      {/if}
      {#if booking.paymentStatus === 'PENDING'}
        <form action="/dash/orders/bookings?/pay" method="POST" use:updateEnhance id="payForm">
          <button type="submit" class="CrispButton" data-type="dark"> Pay </button>
        </form>
      {/if}
    </div>
  </svelte:fragment>
</Pane>
