<script lang="ts">
  import type { JsonValue } from '@prisma/client/runtime/library';
  import { superForm, type SuperValidated } from 'sveltekit-superforms';
  import type { CMSSchema } from '$lib/schemas';
  import { date } from 'zod';
  import TipTap from '$components/TipTap.svelte';
  import { addToast } from '$store/ToastStore';

  export let { content, id, contentForm } = $$props as {
    id: string;
    content: JsonValue;
    contentForm: SuperValidated<CMSSchema>;
  };

  $: JsonContent = content as {
    hero: string;
    hours: {
      to: string;
      day: string;
      from: string;
    }[];
    location: string;
  };

  const { form, enhance } = superForm(contentForm, {
    id,
    dataType: 'json',
    onSubmit() {
      if (operations.delete.length > 0) {
        JsonContent.hours = JsonContent.hours.filter(
          (_, index) => !operations.delete.includes(index)
        );
      }
      if (operations.add.length > 0) {
        JsonContent.hours = [...JsonContent.hours, ...operations.add];
      }

      form.set({
        id,
        data: JSON.stringify(JsonContent)
      });
    },
    onResult() {
      addToast({ message: 'Content updated' });
      operations = {
        add: [],
        delete: []
      };
    }
  });

  $: operations = {
    add: [],
    delete: []
  } as {
    add: {
      to: string;
      day: string;
      from: string;
    }[];
    delete: number[];
  };
</script>

<form class="ContentForm" use:enhance {id} method="POST" action="/admin?/update">
  <label for="name" class="CrispLabel">
    <span style="color: inherit;" data-mandatory> Hero </span>
    <TipTap name="hero" bind:content={JsonContent.hero} />
  </label>
  <label for="name" class="CrispLabel">
    <span style="color: inherit;" data-mandatory> Location </span>
    <TipTap name="location" bind:content={JsonContent.location} />
  </label>

  <label for="hoursBox" class="CrispLabel">
    <span style="color: inherit;">
      <h3>Hours</h3>
    </span>
    <br />
    <table class="FancyTable">
      <thead>
        <tr>
          <th> Day </th>
          <th> From </th>
          <th> To </th>
          <th>
            <div
              style="width: 100%;  display: flex; flex-direction: row; gap: 12px; justify-content: flex-end"
            >
              <button
                type="button"
                class="CrispButton"
                disabled={!operations.add.every(
                  (i) => i.from.trim() !== '' && i.to.trim() !== '' && i.day.trim() !== ''
                )}
                on:click={() => {
                  // Doc: if all of the operations are not empty, then the button is disabled
                  if (
                    !operations.add.every(
                      (i) => i.from.trim() !== '' && i.to.trim() !== '' && i.day.trim() !== ''
                    )
                  ) {
                    return;
                  }

                  operations.add = [
                    ...operations.add,
                    {
                      from: '08:00',
                      to: '17:00',
                      day: ''
                    }
                  ];
                }}
              >
                Add category
              </button>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {#if JsonContent.hours.length === 0}
          <tr>
            <td colspan="4">
              <i> No hours found </i>
            </td>
          </tr>
        {/if}
        {#each JsonContent.hours as hour, index}
          <tr class:delete={operations.delete.map((i) => i).includes(index)}>
            <td>
              <select class="CrispSelect" name="day" bind:value={hour.day}>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </td>
            <td>
              <input
                type="time"
                name="from"
                class="CrispInput"
                bind:value={hour.from}
                pattern="[0-9]{2}:[0-9]{2}"
              />
            </td>
            <td>
              <input
                name="to"
                type="time"
                class="CrispInput"
                bind:value={hour.to}
                pattern="[0-9]{2}:[0-9]{2}"
              />
            </td>
            <td>
              <div
                style="width: 100%;  display: flex; flex-direction: row; gap: 12px; justify-content: flex-end"
              >
                <button
                  type="button"
                  data-type="danger"
                  class="CrispButton"
                  on:click={() => {
                    operations.delete = [...operations.delete, index];
                  }}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        {/each}
        {#each operations.add as item}
          <tr class:add={operations.add.map((i) => i).includes(item)}>
            <td>
              <select class="CrispSelect" name="day" bind:value={item.day}>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </td>
            <td>
              <input class="CrispInput" type="time" name="from" bind:value={item.from} />
            </td>
            <td>
              <input class="CrispInput" type="time" name="to" bind:value={item.to} />
            </td>
            <td>
              <div
                style="width: 100%;  display: flex; flex-direction: row; gap: 12px; justify-content: flex-end"
              >
                <button
                  type="button"
                  data-type="danger"
                  class="CrispButton"
                  on:click={() => {
                    operations.add = operations.add.filter((i) => i !== item);
                  }}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4">
            Showing {JsonContent.hours.length} items
          </td>
        </tr>
      </tfoot>
    </table>
  </label>

  <footer class="ContentForm__footer">
    <button class="CrispButton" data-type="success" style="--crp-button-height: 25px;" form={id}>
      Save
    </button>
  </footer>
</form>

<style lang="scss">
  .ContentForm {
    width: 100%;
    border: 1px solid #e6e8eb;
    border-radius: 6px;
    box-shadow:
      #00000000 0px 0px 0px 0px,
      #00000000 0px 0px 0px 0px,
      #0000000d 0px 1px 2px 0px;
    @include make-flex($dir: column, $just: flex-start, $align: flex-start);

    &__footer {
      @include box($height: auto);
    }

    &__footer {
      padding: 13px 24px;
      border-top: 1px solid #e6e8eb;
      @include make-flex($dir: row, $just: flex-end);
    }

    & > *:not(&__header):not(&__footer) {
      @include box($height: auto);
      padding: 16px 24px;
      width: 100%;
    }

    .delete {
      & > * {
        background-color: var(--paleRed);
        color: var(--lightRed);
      }
    }

    .add {
      & > * {
        background-color: var(--lightGreen);
        color: var(--green);
      }
    }
  }
</style>
