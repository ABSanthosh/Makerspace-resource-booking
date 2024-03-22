<script lang="ts">
  import type { CartItem, EInstance } from '@prisma/client';
  import BookingPane from './Panes/BookingPane.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  $: selectedItemIDs = [] as string[];
  $: selectedInstances = [] as (CartItem & {
    instance: EInstance;
  })[];

  $: bookingModal = false;
  $: selectAll = false;
</script>

<BookingPane
  bind:modal={bookingModal}
  bind:formStore={data.bookingForm}
  bind:instances={selectedInstances}
/>

<table class="FancyTable">
  <thead>
    <tr>
      <th>
        <div class="w-100 h-100 Row--j-start">
          <input
            type="checkbox"
            class="CrispInput"
            bind:checked={selectAll}
            title="Select all items in cart"
            on:change={() => {
              if (selectAll) {
                selectedItemIDs = data.cart?.items.map((i) => i.id) ?? [];
                selectedInstances = data.cart?.items ?? [];
              } else {
                selectedItemIDs = [];
              }
            }}
          />
        </div>
      </th>
      <th> Instance Name </th>
      <th> Slot Date </th>
      <th> Start time </th>
      <th> End time </th>
      <th> Cost </th>
      <th> </th>
    </tr>
  </thead>
  <tbody>
    {#if data.cart && data.cart.items.length > 0}
      {#each data.cart.items as item}
        <tr class:selected={selectedItemIDs.includes(item.id)}>
          <td>
            <input
              type="checkbox"
              value={item.id}
              name="selectedItems"
              class="CrispInput"
              on:change={(e) => {
                if (selectAll) {
                  selectAll = false;
                }
                // @ts-ignore
                if (e.target?.checked) {
                  selectedInstances = [...selectedInstances, item];
                } else {
                  selectedInstances = selectedInstances.filter((i) => i.id !== item.id);
                }
              }}
              bind:group={selectedItemIDs}
            />
          </td>
          <td>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="/equipment/{item.instance.equipment.id}"
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
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
          </td>
          <td>
            {new Date(item.end).toLocaleString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
          </td>
          <td>{item.instance.cost}</td>
          <td> </td>
        </tr>
      {/each}
    {:else}
      <tr>
        <td colspan="7">
          <i class="CrispMessage" data-type="info" data-format="box"> No items in cart </i>
        </td>
      </tr>
    {/if}
  </tbody>
  <tfoot>
    <tr>
      <td colspan="7">
        <div class="w-100 Row--between">
          <span>
            Showing {data.cart?.items.length ?? 0} result(s)
          </span>
          <div class="Row--center gap-10">
            <button
              data-type="danger"
              class="CrispButton"
              style="--crp-button-height: 25px;"
              disabled={selectedItemIDs.length === 0}
            >
              Delete
            </button>

            <button
              data-type="success"
              class="CrispButton"
              style="--crp-button-height: 25px;"
              disabled={selectedItemIDs.length === 0}
              on:click={() => (bookingModal = true)}
            >
              Make a booking
            </button>
          </div>
        </div>
      </td>
    </tr>
  </tfoot>
</table>

<style lang="scss">
  .FancyTable {
    tr {
      &.selected {
        transition: background-color 0.2s ease-in-out;
        background-color: var(--lightBlue);
      }
    }
  }

  // &__section {
  //   gap: 32px;
  //   width: 100%;
  //   border: 1px solid #e6e8eb;
  //   border-radius: 6px;
  //   box-shadow:
  //     #00000000 0px 0px 0px 0px,
  //     #00000000 0px 0px 0px 0px,
  //     #0000000d 0px 1px 2px 0px;
  //   @include make-flex($dir: column, $just: flex-start, $align: flex-start);

  //   &--header,
  //   &--footer {
  //     @include box($height: auto);
  //   }

  //   &--header {
  //     border-bottom: 1px solid #e6e8eb;
  //     padding: 16px 24px;
  //     & > h5 {
  //       font-size: 18px;
  //       font-weight: 500;
  //     }
  //   }

  //   &--content {
  //     gap: 15px;
  //     @include make-flex();

  //     .CrispLabel {
  //       & > div {
  //         gap: 10px;
  //         width: 60%;
  //         @include make-flex();
  //         @include respondAt(620px) {
  //           width: 100%;
  //         }
  //       }
  //       &[data-direction='row'] {
  //         @include respondAt(620px) {
  //           flex-direction: column;
  //         }
  //       }
  //     }
  //   }

  //   &--footer {
  //     padding: 13px 24px;
  //     border-top: 1px solid #e6e8eb;
  //     @include make-flex($dir: row, $just: flex-end);
  //   }

  //   & > *:not(&--header):not(&--footer) {
  //     @include box($height: auto);
  //     padding: 16px 24px;
  //     width: 100%;
  //   }
  // }
</style>
