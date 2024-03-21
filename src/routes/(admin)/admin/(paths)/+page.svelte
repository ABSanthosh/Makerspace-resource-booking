<script lang="ts">
  import type { PageData } from './$types';
  import HomeCMS from './FormPanes/HomeCMS.svelte';

  export let data: PageData;

  $: currentContent = data.content.find((item) => item.id === data.pathParam) || data.content[0];
</script>

<div class="Admin">
  <aside>
    <h3>Path Content</h3>
    <ul>
      {#each data.content as item, index}
        <li>
          <a
            href="?path={item.id}"
            class:active={item.id === data.pathParam || (data.pathParam === null && index === 0)}
          >
            {item.name}
          </a>
        </li>
      {/each}
    </ul>
  </aside>
  <main class="Admin__contentWrapper">
    <div class="Admin__content">
      <h1>Page: {currentContent.name}</h1>
      {#if data.pathParam === currentContent.id || data.pathParam === null}
        <HomeCMS
          bind:id={currentContent.id}
          bind:content={currentContent.data}
          bind:contentForm={data.contentForm}
        />
      {/if}
    </div>
  </main>
</div>

<style lang="scss">
  .Admin {
    display: grid;
    height: 100vh;
    max-height: 100vh;
    overflow-x: auto;
    grid-template-columns: 255px 1fr;

    & > aside {
      display: grid;
      grid-template-rows: 48px 1fr;
      border-right: 1px solid var(--border);

      & > h3 {
        font-size: 18px;
        font-weight: 500;
        padding: 16px;
        border-bottom: 1px solid var(--border);
      }

      & > ul {
        overflow-x: hidden;
        overflow-y: auto;
        padding: 12px;
        gap: 8px;
        list-style: none;
        li {
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: 0.2s ease;
          @include box($height: 28px);
          @include make-flex($just: flex-start);
          & > a {
            @include box();
            text-decoration: none;
            padding: 4px 12px;
            @include make-flex($align: flex-start);
            border-radius: 4px;
            &.active {
              background: #ecedf1;
            }
            &:hover {
              font-weight: 600;
            }
          }
        }
      }
    }

    &__contentWrapper {
      @include box();
      min-width: 630px;
      overflow-y: auto;
      @include make-flex($just: flex-start);
    }

    &__content {
      gap: 24px;
      padding: 16px;
      margin: 64px auto;
      max-width: $maxDashWidth;
      @include box($height: auto);
      @include make-flex($just: flex-start, $align: flex-start);

      & > h1 {
        font-size: 30px;
        font-weight: 500;
      }
    }
  }
</style>
