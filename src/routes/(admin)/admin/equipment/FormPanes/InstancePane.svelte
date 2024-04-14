<script lang="ts">
  import { superForm, type SuperValidated } from 'sveltekit-superforms';
  import type { EItemSchema } from '$lib/schemas';
  import { addToast } from '$store/ToastStore';
  import Pane from '$components/Pane.svelte';
  import TipTap from '$components/TipTap.svelte';
  import { EStatus, EBillingType } from '@prisma/client';
  import WeekDays from '$components/WeekDays.svelte';

  export let { currentInstance, modal, formStore } = $$props as {
    modal: boolean;
    currentInstance: EItemSchema;
    formStore: SuperValidated<EItemSchema>;
  };

  const {
    form: instanceForm,
    errors: instanceErrors,
    enhance: instanceEnhance
  } = superForm(formStore, {
    id: 'instanceForm',
    dataType: 'json',
    onResult(event) {
      if (event.result.status === 200) {
        addToast({ message: 'Instance Upserted', type: 'success' });
        modal = false;
      }
    }
  });

  $: isEdit = $instanceForm.id !== undefined;
</script>

<Pane bind:open={modal} style="--paneWidth: 485px;" on:close={() => {}}>
  <p slot="header">Instance: {$instanceForm.name}</p>
  <svelte:fragment slot="main">
    <form
      method="POST"
      use:instanceEnhance
      id="instanceForm"
      class="Col--center gap-10 w-100"
      action="/admin/equipment?/upsertInstance"
    >
      <label
        class="CrispLabel"
        for="name"
        data-direction="row"
        style="justify-content: space-between;"
      >
        <span data-mandatory style="color: inherit;"> Name </span>
        <input
          id="name"
          type="text"
          name="name"
          class="CrispInput"
          style="--crp-input-width: 50%"
          bind:value={$instanceForm.name}
          aria-invalid={$instanceForm.name ? 'true' : undefined}
        />
      </label>
      {#if $instanceErrors.name}
        <p class="CrispMessage w-100" data-type="error">
          {$instanceErrors.name}
        </p>
      {/if}
      <label
        class="CrispLabel"
        for="cost"
        data-direction="row"
        style="justify-content: space-between;"
      >
        <span data-mandatory style="color: inherit;"> Cost </span>
        <input
          id="cost"
          type="number"
          name="cost"
          class="CrispInput"
          style="--crp-input-width: 50%"
          bind:value={$instanceForm.cost}
          aria-invalid={$instanceForm.cost ? 'true' : undefined}
        />
      </label>
      {#if $instanceErrors.cost}
        <p class="CrispMessage w-100" data-type="error">
          {$instanceErrors.cost}
        </p>
      {/if}

      <label
        class="CrispLabel"
        for="billingType"
        data-direction="row"
        style="justify-content: space-between;"
      >
        <span data-mandatory style="color: inherit;"> Billing Type </span>
        <select
          id="billingType"
          class="CrispSelect"
          style="--crp-select-width: 50%;"
          bind:value={$instanceForm.billingType}
          aria-invalid={$instanceForm.billingType ? 'true' : undefined}
        >
          {#each Object.values(EBillingType) as item}
            <option value={item}>{item}</option>
          {/each}
        </select>
      </label>
      {#if $instanceErrors.billingType}
        <p class="CrispMessage w-100" data-type="error">
          {$instanceErrors.billingType}
        </p>
      {/if}

      <label
        class="CrispLabel"
        for="status"
        data-direction="row"
        style="justify-content: space-between;"
      >
        <span data-mandatory style="color: inherit;"> Status </span>
        <select
          id="status"
          class="CrispSelect"
          style="--crp-select-width: 50%;"
          bind:value={$instanceForm.status}
          aria-invalid={$instanceForm.status ? 'true' : undefined}
        >
          {#each Object.values(EStatus) as item}
            <option value={item}>{item}</option>
          {/each}
        </select>
      </label>
      {#if $instanceErrors.status}
        <p class="CrispMessage w-100" data-type="error">
          {$instanceErrors.status}
        </p>
      {/if}
      <label
        class="CrispLabel"
        for="starts"
        data-direction="row"
        style="justify-content: space-between;"
      >
        <span data-mandatory style="color: inherit;"> Start </span>
        <input
          id="start"
          type="time"
          name="start"
          class="CrispInput"
          style="--crp-input-width: 50%"
          bind:value={$instanceForm.availability.starts}
          aria-invalid={$instanceForm.availability.starts ? 'true' : undefined}
        />
      </label>
      {#if $instanceErrors.availability?.starts}
        <p class="CrispMessage w-100" data-type="error">
          {$instanceErrors.availability?.starts}
        </p>
      {/if}

      <label
        class="CrispLabel"
        for="ends"
        data-direction="row"
        style="justify-content: space-between;"
      >
        <span data-mandatory style="color: inherit;"> End </span>
        <input
          id="end"
          type="time"
          name="end"
          class="CrispInput"
          style="--crp-input-width: 50%"
          bind:value={$instanceForm.availability.ends}
          aria-invalid={$instanceForm.availability.ends ? 'true' : undefined}
        />
      </label>
      {#if $instanceErrors.availability?.ends}
        <p class="CrispMessage w-100" data-type="error">
          {$instanceErrors.availability?.ends}
        </p>
      {/if}

      <label
        class="CrispLabel"
        for="repeat"
        data-direction="row"
        style="justify-content: space-between;"
      >
        <span data-mandatory style="color: inherit;"> Frequency </span>
        <WeekDays bind:days={$instanceForm.availability.repeat} />
      </label>
      {#if $instanceErrors.availability?.repeat}
        <p class="CrispMessage w-100" data-type="error">
          {$instanceErrors.availability?.repeat}
        </p>
      {/if}

      <!-- {#if $instanceForm.availability.starts && $instanceForm.availability.ends && $instanceForm.availability.repeat}
				<i class="CrispMessage" data-type="info" data-format="box">
					Every week from {$instanceForm.availability.starts} to {$instanceForm.availability.ends}
					on {$instanceForm.availability.repeat.join(', ')}, the instance will be available for
					booking.
				</i>
			{/if} -->

      <label
        class="CrispLabel"
        for="maxOffset"
        data-direction="row"
        style="justify-content: space-between;"
      >
        <span
          data-mandatory
          style="color: inherit;"
          title="The maximum number of months from today that the instance can be booked in advance."
        >
          Max Month Offset
        </span>
        <input
          id="maxOffset"
          type="number"
          name="maxOffset"
          class="CrispInput"
          style="--crp-input-width: 50%"
          bind:value={$instanceForm.availability.maxOffset}
          aria-invalid={$instanceForm.availability.maxOffset ? 'true' : undefined}
        />
      </label>

      <label
        class="CrispLabel"
        for="slotSize"
        data-direction="row"
        style="justify-content: space-between;"
      >
        <span data-mandatory style="color: inherit;" title="The size of each slot in minutes.">
          Slot Size(mins)
        </span>
        <input
          id="slotSize"
          type="number"
          name="slotSize"
          class="CrispInput"
          style="--crp-input-width: 50%"
          bind:value={$instanceForm.availability.slotSize}
          aria-invalid={$instanceForm.availability.slotSize ? 'true' : undefined}
        />
      </label>

      <label class="CrispLabel" for="description">
        <span style="color: inherit;"> Description </span>
        <TipTap name="description" bind:content={$instanceForm.description} />
      </label>
      {#if $instanceErrors.description}
        <p class="CrispMessage w-100" data-type="error">
          {$instanceErrors.description}
        </p>
      {/if}
    </form>
  </svelte:fragment>
  <svelte:fragment slot="footer">
    <button
      class="CrispButton"
      form="instanceForm"
      style="--height: 30px"
      data-type="black-outline"
    >
      {isEdit ? 'Update' : 'Create'}
    </button>
  </svelte:fragment>
</Pane>
