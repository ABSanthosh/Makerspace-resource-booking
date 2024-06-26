<script lang="ts">
  import { page } from '$app/stores';
  import clickOutside from '$directive/clickOutside';
  import type { Route } from '$lib/routes';
  import { SessionStore } from '$store/SupaStore';

  $: user = $SessionStore!.user;
  export let routes: Route[];

  $: userName = user.user_metadata.name;
  $: userEmail = user.user_metadata.email;
  $: userPicture = user.user_metadata.picture;

  $: navState = false;
  $: collapsibleState = {
    ...Object.fromEntries(
      routes.filter((item) => item.children.length > 0).map((item) => [item.route, false])
    )
  } as Record<string, boolean>;

  $: userProfileMenu = false;
</script>

<div class="Sidebar" class:open={navState || userProfileMenu}>
  <div class="Sidebar__logo Row--between gap-15">
    <a href="/">
      <img src="/assets/images/logo.svg" alt="logo" />
    </a>
  </div>
  <ul class="Sidebar__menuList">
    {#each routes as route}
      {#if route.children.length === 0}
        <a
          class="Sidebar__menuList--item"
          href={route.route}
          class:active={route.route === $page.url.pathname ||
            route.alt?.some((alt) => alt === $page.url.pathname)}
          data-icon={String.fromCharCode(route.icon)}
          title={route.name}
        >
          <span>
            {route.name}
          </span>
        </a>
      {:else if route.children.length > 0}
        <details
          class="Sidebar__subMenu"
          open={collapsibleState[route.route]}
          title={!navState ? route.name : ''}
        >
          <!-- svelte-ignore missing-declaration -->
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <summary
            data-icon={String.fromCharCode(route.icon)}
            data-icon-after={String.fromCharCode(58831)}
            class:active={route.children.some((child) => child.route === $page.url.pathname) ||
              $page.url.pathname === route.route}
            on:click={(e) => {
              e.preventDefault();
              if (!navState) navState = true;
              collapsibleState[route.route] = !collapsibleState[route.route];
            }}
          >
            <span>
              {route.name}
            </span>
          </summary>
          <div class="Sidebar__subMenu--content">
            {#each route.children as child}
              <a
                href={child.route}
                class="Sidebar__menuList--item"
                class:active={$page.url.pathname === child.route}
              >
                <span>
                  {child.name}
                </span>
              </a>
            {/each}
          </div>
        </details>
      {/if}
    {/each}
  </ul>
  <div class="Sidebar__bottom">
    <details
      data-no-marker
      use:clickOutside
      class="CrispMenu w-100"
      bind:open={userProfileMenu}
      on:outclick={() => (userProfileMenu = false)}
    >
      <summary>
        <div class="Sidebar__user">
          <span
            style="background-image: url('{userPicture}'); background-size: cover; background-position: center;"
          />
          <div class="Sidebar__bottom--col">
            <p title={userName}>{userName}</p>
            <span title={userEmail}>{userEmail}</span>
          </div>
        </div>
      </summary>
      <ul class="CrispMenu__content" data-direction="top" data-align="left">
        <form action="/auth?/logout" method="POST" class="w-100">
          <button
            tabindex="-1"
            type="submit"
            title="Logout"
            data-type="danger"
            class="CrispButton w-100"
          >
            Log out
          </button>
        </form>
      </ul>
    </details>

    <button
      class={`CrispButton Sidebar__toggle${navState || userProfileMenu ? '--active' : '--item'}`}
      on:click={() => {
        navState = !navState;
        collapsibleState = {
          ...collapsibleState,
          ...Object.fromEntries(
            routes.filter((item) => item.children.length > 0).map((item) => [item.route, false])
          )
        };
      }}
      data-icon={String.fromCharCode(58828)}
    />
  </div>
</div>

<style lang="scss">
  .Sidebar {
    gap: 15px;
    max-height: 100vh;
    @include box(56px);
    overflow-x: hidden;
    @include make-flex();
    background-color: #f8f9fa;
    border-right: 1px solid var(--border);
    // padding: 20px 8px 10px 10px;
    padding: 8px;
    z-index: 1;
    transition: all 0.3s ease-in-out;

    @include respondAt(845px) {
      position: fixed;
      top: 0;
      left: 0;
    }

    &.open {
      gap: 30px;
      @include box(250px);
      padding: 40px 20px 15px 20px;

      .Sidebar__menuList {
        @include box(calc(100% + 15px), fit-content);

        scrollbar-gutter: stable;
        padding-left: 6px;
        margin-left: -13px;
      }
    }

    &__logo {
      @include box(100%, 40px);
      img {
        @include box(100%, 80%);
        object-fit: contain;
      }
    }

    &__menuList {
      gap: 10px;
      flex-grow: 1;
      direction: rtl;
      overflow-y: auto;
      overflow-x: hidden;
      @include box(100%, fit-content);
      @include make-flex($just: flex-start, $dir: column);

      & > * {
        direction: ltr;
      }

      &--item,
      summary {
        gap: 8px;
        flex-shrink: 0;
        color: #7e868c;
        cursor: pointer;
        padding: 0px 8px;
        border-radius: 7px;
        position: relative;
        line-height: normal;
        white-space: nowrap;
        text-decoration: none;
        @include box(calc(100% - 2px), 35px);
        background-color: transparent;
        border: 1px solid transparent;
        @include make-flex($dir: row, $just: flex-start);
        overflow: hidden;
        border: 1px solid transparent;
        transition:
          color 0.15s ease-in-out,
          background-color 0.15s ease-in-out;

        & > span {
          color: inherit;
          transition: inherit;
        }

        &.active {
          background-color: #e6e8eb;
          color: #11181c;
          &::before {
            color: #11181c;
          }
        }

        &:not(&.active) {
          &::before {
            transition: inherit;
          }
          &:hover,
          &:focus {
            outline: none;
            background-color: #e6e8eb;

            &::before {
              color: #11181c;
            }
            & > span {
              color: #11181c;
            }
          }
        }
      }
    }

    &__toggle {
      &::before {
        transition: transform 0.3s;
      }

      &--active,
      &--item {
        border: 1px solid #eaecf0;
        outline: none;
        cursor: pointer;
        border-radius: 5px;
        background-color: rgb(241, 241, 241);
        @include box(100%, 37px);
        @include make-flex();

        &:hover,
        &:focus {
          outline: none;
          background-color: #f4f5f6;
        }
      }

      &--active {
        align-items: flex-end !important;
        padding-right: 10px;
        &::before {
          transform: rotate(180deg);
        }
      }
    }

    &__subMenu {
      @include box(100%, auto);

      &[open] {
        summary {
          &::after {
            transform: rotate(0deg);
          }
        }
      }

      & > summary {
        list-style: none;
        &::after {
          transition: transform 0.2s ease-in-out;
          transform: rotate(-90deg);
          margin-left: auto;
        }
        &::-webkit-details-marker {
          display: none;
        }
      }

      &--content {
        gap: 8px;
        padding: 8px;
        margin-top: 10px;
        border-radius: 7px;
        white-space: nowrap;
        @include make-flex();
        @include box(100%, auto);
        border: 1px solid #3440543b;
      }
    }

    &__user {
      display: grid;
      grid-template-columns: 37px 1fr;
      @include box($height: auto);
      gap: 10px;

      align-items: end;
      padding: 10px 3px 10px 3px;
      & > span {
        border-radius: 50%;
        @include box(35px, 35px);
        @include make-flex();
        font-weight: bolder;
      }
    }

    &__bottom {
      gap: 10px;
      @include make-flex($align: flex-start);
      @include box(100%, auto);

      .CrispMenu {
        border-top: 1px solid #eaecf0;
        border-bottom: 1px solid #eaecf0;

        --crp-menu-height: auto;
        --crp-menu-box-shadow: none;
        --crp-menu-summary-padding: 0;
        --crp-menu-background-color: transparent;
        --crp-menu-border: 1px solid transparent;
        --crp-menu-border-hover: 1px solid transparent;

        --crp-menu-content-width: 100%;
      }

      &--col {
        overflow: hidden;
        @include make-flex($align: flex-start);

        span,
        p {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
        }

        p {
          font-size: 14px;
          font-weight: 500;
        }
        span {
          color: #525252;
          font-size: 12px;
        }
      }
    }
  }
</style>
