<script lang="ts">
  import Pane from '$components/Pane.svelte';
  import type { getUserBookings } from '$db/User.db';

  export let { modal, booking } = $$props as {
    modal: boolean;
    booking: Awaited<ReturnType<typeof getUserBookings>>[0];
  };

  $: console.log(booking);
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
          bind:value={booking.deadline}
        />
      </label>
      <label for="instance" class="CrispLabel">
        <span style="color: inherit;"> Instances </span>
        <table class="FancyTable">
          <thead>
            <tr>
              <th> Name </th>
              <th> Slot Date </th>
              <th> Cost </th>
            </tr>
          </thead>
          <tbody>
            {#if booking.items.length >= 0}
              {#each booking.items as item}
                <tr>
                  <td> {item.instance.name} </td>
                  <td>
                    {new Date(item.start).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td> {item.instance.cost} </td>
                </tr>
              {/each}
            {:else}
              <tr>
                <td colspan="3">
                  <i class="CrispMessage" data-type="info" data-format="box"> No items found </i>
                </td>
              </tr>
            {/if}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">
                Showing {booking.items.length} result(s)
              </td>
            </tr>
          </tfoot>
        </table>
      </label>
    </div>
  </svelte:fragment>
</Pane>
