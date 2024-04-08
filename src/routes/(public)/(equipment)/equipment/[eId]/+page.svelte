<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { BreadCrumbStore, isEquipmentDeletedStore } from '$store/BreadCrumbStore';
  import AvailabilityPane from './Panes/AvailabilityPane.svelte';
  import type { EquipmentById } from '$lib/schemas';
  import { EStatus, ESecondaryStatus } from '@prisma/client';
  import { SessionStore } from '$store/SupaStore';
  import ManualViewPane from './Panes/ManualViewPane.svelte';
  import VideoViewPane from './Panes/VideoViewPane.svelte';

  export let data: PageData;
  $: ({ equipment } = data);
  onMount(() => {
    isEquipmentDeletedStore.set(data.isDeleted);
    BreadCrumbStore.update(() => {
      return [
        {
          name: 'Home',
          path: '/'
        },
        {
          name: 'Equipment',
          path: '/equipment'
        },
        {
          name: data.equipment.name,
          path: `/equipment/${data.equipment.id}`
        }
      ];
    });
  });

  $: user = $SessionStore?.user ?? null;
  $: availabilityPane = false;
  $: manualPane = false;
  $: videoPane = false;
  $: selectedInstance = null as EquipmentById['instances'][0] | null;

  $: isUserBlacklisted = user?.app_metadata.custom_claims.is_blacklisted ?? false;
</script>

{#if selectedInstance && user && !isUserBlacklisted}
  <AvailabilityPane
    bind:userId={user.id}
    bind:modal={availabilityPane}
    bind:formStore={data.cartItemForm}
    bind:currentEquipment={data.equipment}
    bind:instanceId={selectedInstance['id']}
  />
{/if}

<ManualViewPane bind:modal={manualPane} bind:currentEquipment={data.equipment} />
<VideoViewPane bind:modal={videoPane} bind:currentEquipment={data.equipment} />

<main class="Equipment">
  <header class="Equipment__header w-100 gap-10">
    <h1 class="w-100">{data.equipment.name}</h1>
    <p class="w-100">{data.equipment.model}</p>
  </header>
  <section class="Equipment__hero">
    <div class="Equipment__imageBox">
      <img src={data.equipment.image} alt={data.equipment.name} />
    </div>
    <div class="Col--j-start w-100 gap-15">
      <h3 class="w-100">
        Description
        <hr />
      </h3>
      <div class="w-100">
        {@html data.equipment.description}
      </div>
      <h3 class="w-100">
        Resources
        <hr />
      </h3>
      <div class="Row--start w-100 gap-15">
        <button
          class="CrispButton"
          data-type="black-outline"
          on:click={() => {
            videoPane = true;
          }}
        >
          Videos
        </button>
        <button
          class="CrispButton"
          data-type="black-outline"
          on:click={() => {
            manualPane = true;
          }}
        >
          Manual
        </button>
      </div>
    </div>
  </section>
  <section class="Equipment__instance Col--j-start">
    <h3 class="w-100">
      Instances
      <hr />
    </h3>
    {#if user && isUserBlacklisted}
      <i class="CrispMessage" data-format="box" data-type="error">
        You are blacklisted and cannot make any bookings. Visit Makerspace to resolve this issue.
      </i>
    {/if}

    <div class="Equipment__tableContainer">
      <table class="FancyTable">
        <thead>
          <tr>
            <th> Instance Name </th>
            <th> Model </th>
            <th> Category </th>
            <th> Cost </th>
            <th> Status </th>
            <th> View Availability</th>
          </tr>
        </thead>
        <tbody>
          {#if equipment.secondaryStatus === ESecondaryStatus.ACTIVE && equipment.instances}
            {#each equipment.instances as item}
              <tr>
                <td>{item.name}</td>
                <td>{equipment.model}</td>
                <td>{equipment?.category?.name}</td>
                <td>{item.cost}</td>
                <td>{item.status}</td>
                <td>
                  {#if user}
                    <button
                      class="CrispButton"
                      disabled={item.status !== EStatus.available || isUserBlacklisted}
                      data-type="black-outline"
                      on:click={() => {
                        selectedInstance = item;
                        availabilityPane = true;
                      }}
                    >
                      View
                    </button>
                  {:else}
                    <i> Login to view availability </i>
                  {/if}
                </td>
              </tr>
            {/each}
          {:else}
            <tr>
              <td colspan="6">
                <i data-type="info" class="CrispMessage w-100 Row--center" data-format="box">
                  This equipment has been deleted
                </i>
              </td>
            </tr>
          {/if}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="6">
              Showing {equipment?.instances.length ?? 0} result(s)
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </section>
</main>

<style lang="scss">
  .Equipment {
    gap: 25px;
    @include box();
    @include make-flex($align: flex-start);

    &__header {
      @include make-flex();
      @include box($height: auto);

      h1 {
        font-size: 40px;
        font-weight: 500;
      }

      p {
        font-size: 20px;
        font-style: italic;
        font-weight: 400;
        color: var(--subText);
      }
    }

    &__imageBox {
      @include box(350px, 350px);
      padding: 25px;
      border-radius: 10px;
      @include make-flex();
      flex-shrink: 0;
      background-color: white;
      border: 1px solid var(--border);

      @include respondAt(900px) {
        @include box(250px, 250px);
      }
    }

    &__hero,
    &__instance {
      gap: 15px;
      @include box();
      h3 {
        gap: 15px;
        font-size: 25px;
        font-weight: 500;
        @include make-flex($dir: row, $just: flex-start);

        hr {
          margin: 10px 0;
          width: 100%;
          border: 1px solid var(--border);
        }
      }
    }

    &__hero {
      @include make-flex($dir: row, $align: flex-start);

      @include respondAt(730px) {
        flex-direction: column;
      }
      img {
        max-width: 500px;
        border-radius: 7px;
        @include box(100%, auto);
      }

      & > div {
        font-size: 18px;
        font-weight: 400;
        white-space: pre-line;
        :global(ul) {
          padding: 0 1rem;

          & :global(li) {
            line-height: 1.5;
          }
        }
      }
    }

    &__tableContainer {
      @include box();
      @include make-flex($align: flex-start);
      overflow: auto;
      & > table {
        padding-bottom: 7px;
      }
    }
  }
</style>
