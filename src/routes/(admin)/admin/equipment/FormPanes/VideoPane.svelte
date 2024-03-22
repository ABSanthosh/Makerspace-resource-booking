<script lang="ts">
  import nanoid from '$lib/nanoid';
  import Pane from '$components/Pane.svelte';
  import { addToast } from '$store/ToastStore';
  import type { Manual, Video } from '@prisma/client';
  import { superForm } from 'sveltekit-superforms/client';
  import type { SuperValidated } from 'sveltekit-superforms';
  import type { ESchema, EVideoCRUDSchema, EVideoSchema } from '$lib/schemas';
  import YtEmbed from '$components/YtEmbed.svelte';

  export let { currentEquipment, modal, formStore } = $$props as {
    modal: boolean;
    formStore: SuperValidated<EVideoCRUDSchema>;
    currentEquipment: (ESchema & { manuals: Manual[]; videos: Video[] }) | null;
  };

  const { form: videoForm, enhance: videoEnhance } = superForm(formStore, {
    id: 'videoForm',
    dataType: 'json',
    onSubmit() {
      videoForm.set({
        add: [...operations.add],
        delete: [...operations.delete].map((i) => i.id!)
      });
    },
    onResult(event) {
      if (event.result.status === 200) {
        addToast({ message: 'Videos updated', type: 'success'  });
        modal = false;
        addModeItem = null;
        operations = {
          add: [],
          delete: []
        };
      }
    },
    taintedMessage: null
  });

  $: eVideos = currentEquipment?.videos;
  $: eId = currentEquipment?.id as string;

  $: operations = {
    add: [],
    delete: []
  } as { add: EVideoSchema[]; delete: EVideoSchema[] };

  $: addModeItem = null as EVideoSchema | null;

  const newInputFocus = (element: HTMLInputElement, id: string) => {
    if (id === addModeItem?.id) {
      element.focus();
    }
  };
</script>

<Pane bind:open={modal} style="--paneWidth: 450px;" on:close={() => (modal = false)}>
  <p slot="header">Videos: {currentEquipment?.name}</p>
  <svelte:fragment slot="main">
    {#if eVideos}
      <form
        method="POST"
        id="videoForm"
        use:videoEnhance
        class="VideoForm"
        style="overflow:hidden"
        action="/admin/equipment?/videoCRUD"
      >
        <table class="FancyTable">
          <thead>
            <tr>
              <th style="width: 100%;"> Videos </th>
              <th
                style="width: 140px; padding: 12px; display: flex; flex-direction: row; gap: 12px; justify-content: flex-end"
              >
                <button
                  type="button"
                  class="CrispButton"
                  disabled={!operations.add.every((i) => i.video.trim() !== '')}
                  on:click={() => {
                    // Doc: if all of the operations are not empty, then the button is disabled
                    if (!operations.add.every((i) => i.video.trim() !== '')) {
                      return;
                    }

                    addModeItem = {
                      id: nanoid(),
                      equipmentId: eId,
                      video: ''
                    };

                    operations.add = [...operations.add, addModeItem];
                  }}
                >
                  Add Video
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {#if eVideos.length === 0}
              <tr>
                <td colspan="2">
                  <i class="CrispMessage" data-type="info" data-format="box"> No videos found </i>
                </td>
              </tr>
            {/if}
            {#each eVideos as item}
              <tr class:delete={operations.delete.map((i) => i.id).includes(item.id)}>
                <td
                  colspan="2"
                  style="max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                >
                  <YtEmbed bind:url={item.video} />
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
                  <div class="Row--center gap-10">
                    <input
                      type="url"
                      class="CrispInput"
                      bind:value={item.video}
                      use:newInputFocus={item.id}
                      style="--crp-input-height: 32px"
                      on:change={() => {
                        operations.add = [...operations.add.filter((i) => i.id !== item.id), item];
                      }}
                    />
                    <button
                      type="button"
                      class="CrispButton"
                      style="--crp-button-width: 30px"
                      data-type="danger"
                      data-icon={String.fromCharCode(58829)}
                      on:click={() => {
                        if (addModeItem) {
                          item = { ...addModeItem };
                          operations.add = operations.add.filter((i) => i.id !== item.id);
                        }
                      }}
                    />
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">
                Showing {eVideos?.length ?? 0} result(s)
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
      form="videoForm"
      data-type="black-outline"
      disabled={operations.add.length === 0 && operations.delete.length === 0}
    >
      Update
    </button>
  </svelte:fragment>
</Pane>

<style lang="scss">
  .VideoForm {
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
