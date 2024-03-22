<script lang="ts">
  import { page } from '$app/stores';

  const tabs = [
    {
      name: 'Cart',
      href: '/dash/orders/cart'
    },
    {
      name: 'Bookings',
      href: '/dash/orders/bookings'
    }
  ];
</script>

<main class="OrdersBox">
  <h1>Your Orders</h1>
  <ul class="OrdersBox__tabGroup">
    {#each tabs as tab}
      <li>
        <a href={tab.href} class:active={$page.url.pathname === tab.href}>{tab.name}</a>
      </li>
    {/each}
  </ul>
  <slot />
</main>

<style lang="scss">
  .OrdersBox {
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

    &__tabGroup {
      list-style: none;
      @include box($height: auto);
      @include make-flex($dir: row, $just: flex-start);

      & > li > a {
        font-size: 14px;
        padding: 8px 16px;
        text-decoration: none;
        color: rgb(112, 112, 112);
        transition: background-color 0.2s;
        border-bottom: 2px solid transparent;
        transition: color 0.2s, border-bottom 0.2s;

        &.active {
          font-weight: 500;
          color: rgb(23, 23, 23);
          border-bottom: 2px solid var(--brightBlue);
        }

        &:hover {
          color: rgb(23, 23, 23);
        }
      }
    }
  }
</style>
