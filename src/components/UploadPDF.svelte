<script lang="ts">
  import type { ValidationErrors } from 'sveltekit-superforms';

  export let { name, errors, pdf } = $$props as {
    name: string;
    pdf: File | string | null;
    errors: string[] | ValidationErrors<any>;
  };
</script>

<label class="CrispLabel UploadPDF" for={name}>
  <span data-mandatory style="color: inherit;"> PDF </span>
  <div class="UploadPDF__dnd">
    <input
      {name}
      id={name}
      type="file"
      accept="application/pdf"
      on:input={(e) => {
        const pdfFile = e.currentTarget.files?.item(0) ?? null;
        pdf = pdfFile;
      }}
      class="CrispInput"
      aria-invalid={errors ? 'true' : undefined}
    />
    {#if pdf && typeof pdf === 'object' && pdf instanceof File}
      <p data-icon={String.fromCharCode(58989)}>
        {pdf.name}
      </p>
    {:else}
      <p data-icon={String.fromCharCode(61595)}>Upload PDF</p>
    {/if}
  </div>

  {#if errors}
    <p class="CrispMessage w-100" data-type="error">
      {errors}
    </p>
  {/if}
</label>

<style lang="scss">
  .UploadPDF {
    gap: 11px;
    @include box($height: auto);
    @include make-flex($align: flex-start);

    &__dnd {
      padding: 5px;
      @include make-flex();
      color: var(--subText);
      @include box($height: 32px);

      p {
        gap: 7px;
        padding: 0 5px;
        font-size: 15px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        @include box($height: 100%);
        @include make-flex($dir: row);
      }

      cursor: pointer;
      border-radius: 7px;
      position: relative;
      border: 2px dashed var(--border);
      background-color: #f4f6f8;
      & > input {
        display: none;
      }
    }
  }
</style>
