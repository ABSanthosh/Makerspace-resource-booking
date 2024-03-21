<script lang="ts">
  import { browser } from '$app/environment';
  import clickOutside from '$directive/clickOutside';
  import { getYtEmbedLink, getYtThumbnail } from '$lib/ytUtils';
  import { onDestroy, onMount } from 'svelte';

  export let { url, modal = false } = $$props as {
    url: string;
    modal?: boolean;
  };

  const hijackEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      modal = false;
      e.preventDefault();
    }
  };

  onMount(() => {
    if (modal) {
      window.addEventListener('keydown', (e) => hijackEscape(e));
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('keydown', (e) => hijackEscape(e));
    }
  });

  $: thumbnail = getYtThumbnail(url);
</script>

<button
  class="YtEmbed"
  type="button"
  style="background-image: url({thumbnail})"
  on:click={() => (modal = true)}
/>

{#if modal}
  <div class="YtEmbed__modal">
    <iframe
      use:clickOutside
      on:outclick={() => (modal = false)}
      width="560"
      height="315"
      src={getYtEmbedLink(url)}
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </div>
{/if}

<style lang="scss">
  .YtEmbed {
    position: relative;
    @include make-flex();
    @include box(100%, 190px);
    background-color: transparent;
    outline: none;
    border: none;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 8px;

    &::after {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath d='M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z' /%3E%3C/svg%3E");
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 50px;
      height: 50px;
      transition:
        height 0.2s,
        width 0.2s;
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.175);
      border-radius: 9px;
      backdrop-filter: blur(5px);
      transition: background-color 0.2s;
    }
    &:hover {
      cursor: pointer;

      &::before {
        background-color: rgba(118, 118, 118, 0.25);
      }

      &::after {
        height: 55px;
        width: 55px;
      }
    }

    &__modal {
      @include box();
      position: fixed;
      top: 0;
      left: 0;
      @include make-flex();
      backdrop-filter: blur(1px);
      z-index: 1;
      background: rgba(240, 242, 244, 75%);
    }
  }
</style>
