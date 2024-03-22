<script lang="ts">
  import type { PageData } from './$types';
  import type { EItemSchema, ESchema } from '$lib/schemas';
  import { type Writable } from 'svelte/store';
  import EquipmentPane from './FormPanes/EquipmentPane.svelte';
  import CategoryPane from './FormPanes/CategoryPane.svelte';
  import clickOutside from '$directive/clickOutside';
  import { enhance } from '$app/forms';
  import ManualPane from './FormPanes/ManualPane.svelte';
  import { ESecondaryStatus, type Manual, type Video } from '@prisma/client';
  import VideoPane from './FormPanes/VideoPane.svelte';
  import InstancePane from './FormPanes/InstancePane.svelte';

  export let data: PageData;

  $: ({
    upsertEquipmentForm,
    allEquipment,
    eCategories,
    categoryForm,
    manualForm,
    videoForm,
    upsertInstanceForm
  } = data);
  $: equipmentModal = false;
  $: manualModal = false;
  $: videoModal = false;
  $: instanceModal = false;
  $: editItem = {} as (ESchema & { manuals: Manual[]; videos: Video[] }) | null;

  $: eCategoriesModal = false;
  $: editMenuId = '';

  const resetForm = (form: Writable<ESchema>) => {
    form.set({
      name: '',
      model: '',
      image: '',
      description: '',
      eCategoriesId: '',
      secondaryStatus: ESecondaryStatus.ACTIVE
    });
  };

  $: equipmentSearch = '';
  $: searchEquipment = allEquipment?.filter((item) =>
    item.name.toLowerCase().includes(equipmentSearch.toLowerCase())
  );
</script>

{#if equipmentModal}
  <!-- Doc: need to be put in a if condition because Tiptap editor inside the pane
will initially have empty content on first load because there's a render considering
the pane is for new equipment but later, when content is updated inside the "$:" block,
the tiptap editor will not be re-rendered so the content will not be updated in the editor 
if its for editing an existing equipment.

Putting it in the if block will only render the pane when the modal is open and the content	
is properly set.
-->
  <EquipmentPane
    {resetForm}
    bind:eCategories
    bind:modal={equipmentModal}
    bind:formStore={upsertEquipmentForm}
  />
{/if}

{#if instanceModal}
  <InstancePane bind:modal={instanceModal} bind:formStore={upsertInstanceForm} />
{/if}

<ManualPane bind:modal={manualModal} bind:formStore={manualForm} bind:currentEquipment={editItem} />
<VideoPane bind:modal={videoModal} bind:formStore={videoForm} bind:currentEquipment={editItem} />
<CategoryPane bind:formStore={categoryForm} bind:eCategories bind:modal={eCategoriesModal} />

<main class="AdminEquipment">
  <header>
    <input
      type="search"
      class="CrispInput"
      bind:value={equipmentSearch}
      placeholder="Search equipment"
    />
    <span class="Row--center gap-15">
      <button class="CrispButton" on:click={() => (eCategoriesModal = !eCategoriesModal)}>
        Manage categories
      </button>

      <button
        class="CrispButton"
        data-type="dark-blue"
        on:click={() => {
          equipmentModal = !equipmentModal;
          if (upsertEquipmentForm) {
            upsertEquipmentForm.data = {
              name: '',
              model: '',
              image: '',
              description: '',
              eCategoriesId: '',
              secondaryStatus: ESecondaryStatus.ACTIVE
            };
          }
        }}
      >
        Add equipment
      </button>
    </span>
  </header>
  <div class="AdminEquipment__content">
    <table class="FancyTable">
      <thead>
        <tr>
          <th> Equipment Name </th>
          <th> Model </th>
          <th> Category </th>
          <th> </th>
        </tr>
      </thead>
      <tbody>
        {#if searchEquipment && searchEquipment.length > 0}
          {#each searchEquipment as item}
            <!-- Ref: https://svelte.dev/docs/special-tags#const -->
            {@const isDeleted = item.secondaryStatus === ESecondaryStatus.DELETED}
            {@const isDisabled = item.secondaryStatus === ESecondaryStatus.DISABLED}
            <tr class:disabled={isDeleted || isDisabled} title="Equipment is disabled">
              <td> {item.name} </td>
              <td> {item.model} </td>
              <td> {item.category.name} </td>
              <td>
                <details
                  data-no-marker
                  use:clickOutside
                  open={editMenuId === item.id}
                  class="CrispMenu AdminEquipment__content--menu"
                  on:outclick={() => {
                    editMenuId = '';
                    return false;
                  }}
                >
                  <summary>
                    <button
                      class="CrispButton"
                      data-icon={String.fromCharCode(58835)}
                      style="--crp-button-height: 24px; 
												--crp-button-width: auto; 
												--crp-button-padding-left: 6px; 
												--crp-button-padding-right: 6px;"
                      data-type="ghost"
                      on:click={() => (editMenuId = item.id)}
                    />
                  </summary>
                  <ul
                    class="AdminEquipment__content--box CrispMenu__content"
                    data-align="top"
                    data-direction="left"
                  >
                    <button
                      class="CrispButton"
                      data-border="false"
                      class:active={editMenuId === item.id}
                      on:click={() => {
                        if (upsertEquipmentForm) {
                          upsertEquipmentForm.data = {
                            ...item,
                            // Doc: We have to remove the ?cache from the image URL so it won't be cycled
                            // the name of the image file when we update the image
                            image: item.image.split('?')[0],
                            secondaryStatus: item.secondaryStatus
                          };
                        }
                        equipmentModal = true;
                        editMenuId = '';
                      }}
                    >
                      Edit
                    </button>
                    <button
                      class="CrispButton"
                      data-border="false"
                      class:active={editMenuId === item.id}
                      on:click={() => {
                        editItem = {
                          ...item,
                          image: item.image.split('?')[0],
                          manuals: item.manuals,
                          videos: item.videos
                        };
                        videoModal = true;
                        editMenuId = '';
                      }}
                    >
                      Videos
                    </button>
                    <button
                      class="CrispButton"
                      data-border="false"
                      class:active={editMenuId === item.id}
                      on:click={() => {
                        editItem = {
                          ...item,
                          image: item.image.split('?')[0],
                          manuals: item.manuals,
                          videos: item.videos
                        };
                        manualModal = true;
                        editMenuId = '';
                      }}
                    >
                      Manuals
                    </button>
                    <form
                      use:enhance
                      class="w-100"
                      method="POST"
                      action="/admin/equipment?/{isDeleted ? 'enable' : 'disable'}"
                      on:submit={() => {
                        return confirm(
                          `Are you sure you want to ${
                            isDeleted ? 're-enable' : 'delete'
                          } this equipment?`
                        );
                      }}
                    >
                      <input type="hidden" name="id" value={item.id} />
                      <button
                        class="CrispButton"
                        data-type={isDeleted ? 'success' : 'danger'}
                        data-border="false"
                        class:active={editMenuId === item.id}
                      >
                        {isDeleted ? 'Enable' : 'Disable'}
                      </button>
                    </form>
                    <form
                      use:enhance
                      class="w-100"
                      method="POST"
                      action="/admin/equipment?/delete"
                      on:submit={() => {
                        return confirm(
                          'Are you sure you want to delete this equipment permanently?'
                        );
                      }}
                    >
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="imageId" value={item.image} />
                      <button
                        class="CrispButton"
                        data-type="danger"
                        data-border="false"
                        class:active={editMenuId === item.id}
                      >
                        Delete
                      </button>
                    </form>
                  </ul>
                </details>
              </td>
            </tr>
            <tr>
              <td colspan="4" class="AdminEquipment__subTableBox">
                <table class="FancyTable">
                  <thead>
                    <tr>
                      <th> Instance Name </th>
                      <th> Model </th>
                      <th> Category </th>
                      <th> Cost </th>
                      <th> Status </th>
                      <th>
                        <div class="Row--j-end w-100 h-100">
                          <button
                            type="button"
                            class="CrispButton"
                            style="--crp-button-height: 24px; 
													--crp-button-width: auto; 
													--crp-button-padding-left: 6px; 
													--crp-button-padding-right: 6px;"
                            on:click={() => {
                              instanceModal = true;
                              if (upsertInstanceForm) {
                                upsertInstanceForm.data = {
                                  name: `${item.name} - ${item.instances.length + 1}`,
                                  cost: '0',
                                  description: '',
                                  availability: {
                                    ends: '',
                                    starts: '',
                                    repeat: [],
                                    maxOffset: 1
                                  },
                                  equipmentId: item.id
                                };
                              }
                            }}
                          >
                            Add Instance
                          </button>
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {#if !isDeleted && item.instances.length > 0}
                      {#each item.instances as instance}
                        <tr>
                          <td> {instance.name} </td>
                          <td> {item.model} </td>
                          <td> {item.category.name} </td>
                          <td> {instance.cost} </td>
                          <td> {instance.status} </td>
                          <td>
                            <div class="Row--j-end w-100 h-100">
                              <button
                                class="CrispButton"
                                style="--crp-button-height: 24px; 
																--crp-button-width: auto; 
																--crp-button-padding-left: 6px; 
																--crp-button-padding-right: 6px;"
                                on:click={() => {
                                  instanceModal = true;
                                  if (upsertInstanceForm) {
                                    upsertInstanceForm.data = instance;
                                  }
                                }}
                              >
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      {/each}
                    {:else}
                      <tr>
                        <td colspan="6">
                          <i class="CrispMessage" data-format="box" data-type="error">
                            No instances found
                          </i>
                        </td>
                      </tr>
                    {/if}
                  </tbody>
                </table>
              </td>
            </tr>
          {/each}
        {:else}
          <tr class="empty">
            <td colspan="4">
              <i class="CrispMessage" data-type="error" data-format="box"> No results found </i>
            </td>
          </tr>
        {/if}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="5">
            Showing {allEquipment?.length ?? 0} result(s)
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</main>

<style lang="scss">
  .AdminEquipment {
    gap: 24px;
    padding: 24px;
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

    &__subTableBox {
      padding: 0 0 0 24px;
      position: relative;
      &::before {
        content: '';
        left: 12px;
        display: block;
        @include box(10px, 20px);
        border-radius: 0 0 0 6px;
        position: absolute;
        border-top: 0px solid transparent;
        border-left: 2px dashed #c1c3c6;
        border-right: 0px solid transparent;
        border-bottom: 2px dashed #c1c3c6;
      }

      &:hover {
        background-color: #ffa;
        transition: background-color 0.3s ease-in-out;
      }

      .FancyTable {
        tr {
          & > th {
            border-top: 0;
            // background-color: rgb(243, 243, 243);
            padding: 9px 12px 9px 14px;
            &:first-child {
              border-top-left-radius: 0;
              border-top-right-radius: 0;
            }

            &:last-child {
              border-top-right-radius: 0;
              border-right: 0;
            }
          }

          & > td {
            padding: 9px 14px;
            &:last-child {
              width: 20px;
              border-right: 0;
              text-align: center;
            }
          }
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

      .FancyTable {
        tr {
          &:hover + tr .AdminEquipment__subTableBox {
            background-color: #ffa;
            transition: background-color 0.3s ease-in-out;
          }
        }
      }

      .disabled {
        background-color: var(--lightOrangeBrown);
        & > td {
          font-style: italic;
          color: var(--orangeBrown);
          border-top: 1px solid var(--orangeBrown);
          border-bottom: 1px solid var(--orangeBrown);
        }
      }

      &--box {
        @include box(100px, auto);

        button {
          width: 100%;
          // border: 0px solid transparent;

          &.active {
            --crp-button-border: 1px solid #dfe3e6;
          }
        }
      }

      &--menu {
        min-width: unset;
        @include box(34px, 24px);
        --crp-menu-offset: 4px;
        & > summary {
          @include box(34px, 24px);
          border: 1px solid transparent;
          box-shadow: 0px 0px 0px transparent;
          padding: 0;

          &:hover {
            background-color: transparent;
          }

          &::before {
            content: '';
          }
        }
      }
    }
  }
</style>
