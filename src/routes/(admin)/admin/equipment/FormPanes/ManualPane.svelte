<script lang="ts">
  import nanoid from '$lib/nanoid';
  import Pane from '$components/Pane.svelte';
  import { SupabaseEnum } from '$lib/Enums';
  import { addToast } from '$store/ToastStore';
  import { getStorageUrl } from '$lib/SupabaseUtils';
  import type { Manual, Video } from '@prisma/client';
  import UploadPdf from '$components/UploadPDF.svelte';
  import { superForm } from 'sveltekit-superforms/client';
  import type { SuperValidated } from 'sveltekit-superforms';
  import type { EManualCRUDSchema, EManualSchema, ESchema } from '$lib/schemas';

  export let { currentEquipment, modal, formStore } = $$props as {
    modal: boolean;
    formStore: SuperValidated<EManualCRUDSchema>;
    currentEquipment: (ESchema & { manuals: Manual[]; videos: Video[] }) | null;
  };

  const { form: manualForm, enhance: manualEnhance } = superForm(formStore, {
    id: 'manualForm',
    dataType: 'json',
    taintedMessage: null,
    onSubmit() {
      manualForm.set({
        add: [...operations.add],
        delete: [...operations.delete].map((i) => i.id) as string[]
      });
    },
    onResult(event) {
      if (event.result.status === 200) {
        addToast({ message: 'Manuals updated' });
        modal = false;
        addModeItem = null;
        editModeItem = null;
        operations = {
          add: [],
          delete: []
        };
      }
    }
  });

  $: eManuals = currentEquipment?.manuals;
  $: eId = currentEquipment?.id as string;

  $: operations = {
    add: [],
    delete: []
  } as { add: EManualSchema[]; delete: EManualSchema[] };

  $: editModeItem = null as EManualSchema | null;
  $: addModeItem = null as EManualSchema | null;

  const newInputFocus = (element: HTMLInputElement, id: string) => {
    if (id === addModeItem?.id) {
      element.focus();
    }
  };
</script>

<Pane bind:open={modal} style="--paneWidth: 450px;" on:close={() => (modal = false)}>
  <p slot="header">Manuals: {currentEquipment?.name}</p>
  <svelte:fragment slot="main">
    {#if eManuals}
      <form
        method="POST"
        id="manualForm"
        use:manualEnhance
        class="ManualForm"
        style="overflow:hidden"
        enctype="multipart/form-data"
        action="/admin/equipment?/manualCRUD"
      >
        <table class="FancyTable">
          <thead>
            <tr>
              <th style="width: 100%;"> Name </th>
              <th
                style="width: 140px; padding: 12px; display: flex; flex-direction: row; gap: 12px; justify-content: flex-end"
              >
                <button
                  type="button"
                  class="CrispButton"
                  disabled={!operations.add.every((i) => i.name.trim() !== '' && i.pdf !== '')}
                  on:click={() => {
                    // Doc: if all of the operations are not empty, then the button is disabled
                    if (!operations.add.every((i) => i.name.trim() !== '')) {
                      return;
                    }

                    addModeItem = {
                      name: '',
                      id: nanoid(),
                      equipmentId: eId,
                      pdf: ''
                    };

                    operations.add = [...operations.add, addModeItem];
                  }}
                >
                  Add Manual
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {#if eManuals.length === 0}
              <tr>
                <td colspan="2">
                  <i class="CrispMessage" data-type="info" data-format="box"> No Manuals found </i>
                </td>
              </tr>
            {/if}
            {#each eManuals as item}
              <tr class:delete={operations.delete.map((i) => i.id).includes(item.id)}>
                <td colspan="2">
                  <label for={`edit.name-${item.id}`} class="CrispLabel">
                    <span style="color: inherit;" data-mandatory> Name </span>
                    <input
                      type="text"
                      name={`edit.name-${item.id}`}
                      bind:value={item.name}
                      on:input={(e) => newInputFocus(e.currentTarget, item.id)}
                      class="CrispInput"
                      disabled
                    />
                  </label>
                  <br />
                  <a
                    href={getStorageUrl(SupabaseEnum.MANUAL, item.pdf)}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="CrispButton"
                    style="--crp-button-height: 30px"
                  >
                    View PDF
                  </a>
                  <br />
                  <div class="w-100 Row--j-end">
                    <button
                      class="CrispButton"
                      data-type="danger"
                      type="button"
                      style="--crp-button-height: 28px"
                      on:click={() => {
                        if (operations.delete.map((i) => i.id).includes(item.id)) {
                          operations.delete = operations.delete.filter((i) => i.id !== item.id);
                        } else {
                          operations.delete = [...operations.delete, item];
                        }
                      }}
                    >
                      {operations.delete.map((i) => i.id).includes(item.id) ? 'Cancel' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
            {#each operations.add as item}
              <tr class="add">
                <td colspan="2">
                  <label for="add.name" class="CrispLabel">
                    <div class="Row--between w-100">
                      <span style="color: inherit;" data-mandatory> Name </span>
                      <button
                        data-type="danger"
                        class="CrispButton"
                        data-icon={String.fromCharCode(58829)}
                        style="--crp-button-height: 25px; --crp-button-width: 25px"
                        on:click={() => {
                          operations.add = operations.add.filter((i) => i.id !== item.id);
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      name="add.name"
                      bind:value={item.name}
                      on:input={(e) => newInputFocus(e.currentTarget, item.id)}
                      class="CrispInput"
                    />
                  </label>
                  <br />
                  <UploadPdf name={`add.pdf-${item.id}`} bind:pdf={item.pdf} />
                </td>
              </tr>
            {/each}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">
                Showing {eManuals?.length ?? 0} result(s)
              </td>
            </tr>
          </tfoot>
        </table>
      </form>
    {/if}
  </svelte:fragment>
  <svelte:fragment slot="footer">
    <button
      class="CrispButton"
      form="manualForm"
      style="--crp-button-height: 30px"
      data-type="black-outline"
      disabled={(operations.add.length === 0 && operations.delete.length === 0) ||
        !operations.add.every((i) => i.name.trim() !== '' && i.pdf !== '')}
    >
      Update
    </button>
  </svelte:fragment>
</Pane>

<style lang="scss">
  .ManualForm {
    & > table td {
      padding: 12px 16px;
    }
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
</style>
