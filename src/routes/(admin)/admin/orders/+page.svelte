<script lang="ts">
  import type { getUserBookings } from '$db/Cart.db';

  // import clickOutside from '$directive/clickOutside';
  import type { PageData } from './$types';
  import BookingUpdatePane from './Pane/BookingUpdatePane.svelte';

  export let data: PageData;

  $: orderSearch = '';

  // $: isFilterOpen = false;
  // let filters = [
  //   {
  //     name: 'By Deadline',
  //     checked: false
  //   },
  //   {
  //     name: 'By Status',
  //     checked: false
  //   },
  //   {
  //     name: 'By User',
  //     checked: false
  //   }
  // ];

  $: bookings = data.bookings
    .filter((item) => item.user.email.includes(orderSearch))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  $: bookingModal = false;
  $: selectedBooking = null as null | Awaited<ReturnType<typeof getUserBookings>>[0];
</script>

{#if selectedBooking}
  <BookingUpdatePane
    bind:modal={bookingModal}
    bind:formStore={data.bookingUpdateForm}
    bind:booking={selectedBooking}
  />
{/if}

<main class="AdminOrder">
  <header>
    <input
      type="search"
      class="CrispInput"
      bind:value={orderSearch}
      placeholder="Search Orders by User mail"
    />
    <!-- <span class="Row--center gap-15">
      <details
        use:clickOutside
        bind:open={isFilterOpen}
        class="CrispMenu AdminOrder__filter"
        on:outclick={() => (isFilterOpen = false)}
      >
        <summary data-no-marker data-icon={String.fromCharCode(57682)}>
          Filters
          <span>
            {filters.filter((item) => item.checked).length}
          </span>
        </summary>
        <ul class="CrispMenu__content">
          {#each filters as filter}
            <li class="CrispMenu__item">
              <label class="CrispLabel gap-10" data-direction="row">
                <input type="checkbox" class="CrispInput" bind:checked={filter.checked} />
                {filter.name}
              </label>
            </li>
          {/each}
        </ul>
      </details>
    </span> -->
  </header>
  <div class="AdminOrder__content">
    <table class="FancyTable">
      <thead>
        <tr>
          <th> Mentor </th>
          <th> Deadline </th>
          <th> User name </th>
          <th> Status </th>
          <th> </th>
        </tr>
      </thead>
      <tbody>
        {#if bookings && bookings.length > 0}
          {#each bookings
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .filter((item) => item.user.email.includes(orderSearch)) as booking}
            <tr>
              <td> {booking.mentor} </td>
              <td>
                {new Date(booking.deadline).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </td>
              <td> {booking.user.name} </td>
              <td>
                <span class="AdminOrder__status--{booking.status.toLowerCase()}">
                  {booking.status}
                </span>
              </td>
              <td>
                <span class="Row--j-end w-100">
                  <button
                    class="CrispButton"
                    on:click={() => {
                      selectedBooking = booking;
                      data.bookingUpdateForm.data.adminNotes = booking.adminNotes ?? '';
                      bookingModal = true;
                    }}
                  >
                    View
                  </button>
                </span>
              </td>
            </tr>
          {/each}
        {:else}
          <tr>
            <td colspan="5">
              <i class="CrispMessage" data-type="info" data-format="box"> No bookings found </i>
            </td>
          </tr>
        {/if}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="5">
            Showing {data.bookings.length ?? 0} result(s)
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</main>

<style lang="scss">
  .AdminOrder {
    gap: 24px;
    padding: 24px;
    max-width: $maxDashWidth;
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
