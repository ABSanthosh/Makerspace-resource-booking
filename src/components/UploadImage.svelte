<script lang="ts">
  import { SupabaseEnum } from '$lib/Enums';
  import { getStorageUrl } from '$lib/SupabaseUtils';
  import type { ValidationErrors } from 'sveltekit-superforms';

  export let { name, errors, image } = $$props as {
    name: string;
    image: File | string | null;
    errors: string[] | ValidationErrors<any>;
  };
</script>

<label class="CrispLabel UploadImage" for={name}>
  <span data-mandatory style="color: inherit;"> Image </span>
  <div
    class="UploadImage__dnd"
    data-image={typeof image !== null && image !== '' ? true : undefined}
  >
    <input
      {name}
      id={name}
      type="file"
      accept="image/*"
      on:input={(e) => {
        const imageFile = e.currentTarget.files?.item(0) ?? null;
        if (typeof image === 'string' && imageFile && image !== '') {
          // Doc: Rename the file to the same name as image. This will be used when equipment is updated
          // to replace the old image with the new one.
          const tempFile = new File([imageFile], image, {
            type: imageFile.type,
            lastModified: imageFile.lastModified
          });
          image = tempFile;
        } else if (imageFile) {
          image = imageFile;
        }
      }}
      class="CrispInput"
      aria-invalid={errors ? 'true' : undefined}
    />
    {#if typeof image === 'string' && image !== ''}
      <img src={getStorageUrl(SupabaseEnum.EQUIPMENT, image)} alt="Old" />
    {:else if image}
      <img src={URL.createObjectURL(image)} alt="Uploaded" />
    {:else}
      Upload image
    {/if}
  </div>

  {#if errors}
    <p class="CrispMessage w-100" data-type="error">
      {errors}
    </p>
  {/if}
</label>

<style lang="scss">
  .UploadImage {
    gap: 11px;
    @include box($height: auto);
    @include make-flex($align: flex-start);

    &__dnd {
      padding: 5px;
      @include make-flex();
      color: var(--subText);
      @include box($height: 100px);

      cursor: pointer;
      border-radius: 7px;
      position: relative;
      border: 2px dashed var(--border);
      & > input {
        display: none;
      }

      & > img {
        max-width: 100%;
        max-height: 100%;
        border-radius: 3px;
        object-fit: contain;
      }
      &::before {
        inset: 0;
        opacity: 0;
        color: #fff;
        @include box();
        position: absolute;
        border-radius: 7px;
        @include make-flex();
        content: 'Change image';
        backdrop-filter: blur(0.5px);
        background: rgba(0, 0, 0, 0.5);
        transition: opacity 0.1s ease-in-out;
      }
      &[data-image]:hover::before {
        opacity: 1;
      }
    }
  }
</style>
