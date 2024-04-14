<script lang="ts">
  import Pane from '$components/Pane.svelte';
  import type { BookingSchema } from '$lib/schemas';
  import { addToast } from '$store/ToastStore';
  import { bookingCost } from '$utils/BookingCost';
  import type { CartItem, EInstance } from '@prisma/client';
  import { dateProxy, superForm, type SuperValidated } from 'sveltekit-superforms';

  export let { modal, formStore, instances } = $$props as {
    modal: boolean;
    instances: (CartItem & {
      instance: EInstance;
    })[];
    formStore: SuperValidated<BookingSchema>;
  };

  const { form, errors, enhance, constraints } = superForm(formStore, {
    id: 'bookingForm',
    dataType: 'json',
    taintedMessage: null,
    onSubmit() {
      form.set({
        ...$form,
        cartId: instances[0].cartId,
        deadline: new Date($form.deadline),
        cost: bookingCost(instances)
      });
    },
    onResult(event) {
      if (event.result.status === 200) {
        addToast({ message: 'Booking place for verification', type: 'success' });
        modal = false;
        form.set({
          mentor: '',
          description: '',
          // @ts-ignore
          deadline: undefined,
          instances: [],
          cartId: '',
          adminNotes: ''
        });
        instances = [];
      } else if (event.result.status === 400) {
        modal = false;
        addToast({ message: 'Booking failed', type: 'danger' });
      } else if (event.result.status === 500) {
        modal = false;
        addToast({ message: 'Server error', type: 'danger' });
      }
    }
  });
  // Ref: https://superforms.rocks/concepts/proxy-objects#date-input-issues
  const proxyDate = dateProxy(form, 'deadline', { format: 'date' });

  // Doc: Add all the selected instances to the form
  $: $form.instances = instances.map((i) => i.id);

  // Doc: Get the max end time of all instances so that the deadline is always after the last slot
  $: maxInstanceEndTime =
    instances.length > 0
      ? new Date(Math.max(...instances.map((i) => new Date(i.end).getTime())))
      : new Date();
</script>

<Pane
  bind:open={modal}
  style="--paneWidth: 450px;"
  on:close={() => {
    modal = false;
    $form = {
      mentor: '',
      description: '',
      // @ts-ignore
      deadline: undefined,
      instances: [],
      adminNotes: ''
    };
  }}
>
  <p slot="header">Book Equipment</p>
  <svelte:fragment slot="main">
    <form
      method="POST"
      action="/dash/orders/cart?/book"
      id="bookingForm"
      use:enhance
      class="Col--center gap-15"
    >
      <label for="mentor" class="CrispLabel">
        <span style="color: inherit;" data-mandatory> Mentor </span>
        <input
          id="mentor"
          type="text"
          name="mentor"
          class="CrispInput"
          bind:value={$form.mentor}
          {...$constraints.mentor}
          aria-invalid={$errors.mentor ? 'true' : undefined}
        />
        {#if $errors.mentor}
          <p class="CrispMessage w-100" data-type="error">{$errors.mentor}</p>
        {/if}
      </label>
      <label for="description" class="CrispLabel">
        <span style="color: inherit;" data-mandatory> Description </span>
        <textarea
          id="description"
          name="description"
          class="CrispInput"
          data-type="text-area"
          placeholder="Tell us about your project...(Course, Research, etc)"
          bind:value={$form.description}
          aria-invalid={$errors.description ? 'true' : undefined}
          {...$constraints.description}
        />
        {#if $errors.description}
          <p class="CrispMessage w-100" data-type="error">{$errors.description}</p>
        {/if}
      </label>

      <label for="deadline" class="CrispLabel">
        <span style="color: inherit;" data-mandatory> Deadline </span>
        <input
          id="deadline"
          type="date"
          name="deadline"
          min={maxInstanceEndTime.toISOString().split('T')[0]}
          class="CrispInput"
          bind:value={$proxyDate}
          {...$constraints.deadline}
          aria-invalid={$errors.deadline ? 'true' : undefined}
        />
        {#if $errors.deadline}
          <p class="CrispMessage w-100" data-type="error">{$errors.deadline}</p>
        {/if}
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
          }).format(bookingCost(instances))}
        />
      </label>

      <label for="instance" class="CrispLabel" style="overflow-x: auto; padding-bottom: 10px">
        <span style="color: inherit;"> Instances </span>
        <table class="FancyTable">
          <thead>
            <tr>
              <th> Name </th>
              <th> Slot Date </th>
              <th> Timing </th>
              <th> Billing Type </th>
              <th> Cost </th>
            </tr>
          </thead>
          <tbody>
            {#if instances.length >= 0}
              {#each instances as item}
                <tr>
                  <td> {item.instance.name} </td>
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
                  <td> {item.instance.billingType} </td>
                  <td>
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR'
                    }).format(item.instance.cost)}
                  </td>
                </tr>
              {/each}
            {:else}
              <tr>
                <td colspan="5">
                  <i class="CrispMessage" data-type="info" data-format="box"> No items found </i>
                </td>
              </tr>
            {/if}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5">
                Showing {instances.length} result(s)
              </td>
            </tr>
          </tfoot>
        </table>
      </label>
    </form>
  </svelte:fragment>
  <svelte:fragment slot="footer">
    <button
      class="CrispButton"
      type="submit"
      form="bookingForm"
      data-type="black-outline"
      disabled={$form.mentor === '' ||
        $form.description === '' ||
        $form.deadline === undefined ||
        $form.instances.length === 0}
    >
      Book
    </button>
  </svelte:fragment>
</Pane>
