<script lang="ts">
  export let { crumbs, type } = $$props as {
    type: 'disabled' | undefined;
    crumbs: {
      name: string;
      path: string;
    }[];
  };
</script>

<ul class="BreadCrumb" data-type={type}>
  {#each crumbs as item}
    <li>
      <a href={item.path}>{item.name}</a>
    </li>
  {/each}
</ul>

<style lang="scss">
  .BreadCrumb {
    @include box();
    flex-wrap: wrap;
    column-gap: 5px;
    padding: 5px 15px;
    border-radius: 6px;
    position: relative;
    @include make-flex($dir: row, $just: flex-start);

    transition: background-color 0.15s ease-in-out;

    &:not([data-type]) {
      background-color: var(--lightBlue);
      border: 1px solid transparent;

      & > li > a {
        color: var(--darkBlue);
      }
    }

    &[data-type='disabled'] {
      background-color: var(--yellowOrange);
      border: 1px solid var(--darkYellowOrange);

      &::after {
        content: 'Deleted';
        position: absolute;
        top: 50%;
        right: 0;
        height: 100%;
        font-size: 20px;
        padding: 0 15px;
        font-style: italic;
        color: var(--orangeBrown);
        background-color: var(--yellowOrange);
        border-radius: 6px;
        transform: translateY(-50%);
        @include make-flex($just: center, $align: center);
      }
      & > li > a {
        color: var(--orangeBrown);
      }
    }

    & > li + li:before {
      color: var(--iconColor);
      content: '/';
    }
    & > li {
      @include make-flex($dir: row);
      gap: 5px;
      padding: 8px 0;

      & > a {
        font-size: 18px;
        text-decoration: none;
        transition: opacity 0.15s ease-in-out;
        text-transform: capitalize;
      }

      &:not(:last-child) {
        & > a {
          opacity: 0.5;

          &:hover {
            opacity: 1;
          }
        }
      }
    }
  }
</style>
