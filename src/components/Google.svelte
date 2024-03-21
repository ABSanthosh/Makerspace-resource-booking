<script lang="ts">
  import { SupaStore, SessionStore } from '$store/SupaStore';
  import clickOutside from '$directive/clickOutside';
  import { getCustomClaim } from '$lib/SupabaseUtils';
  import { Role } from '@prisma/client';

  $: isProfileOpen = false;
</script>

{#if $SessionStore === null}
  <button
    class="Google--button CrispButton"
    on:click={async () => {
      await $SupaStore.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
    }}
  >
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      style="display: block;"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
    <span>Sign in</span>
  </button>
{:else}
  <details
    data-no-marker
    use:clickOutside
    bind:open={isProfileOpen}
    class="CrispMenu Google__profile"
    on:outclick={() => (isProfileOpen = false)}
  >
    <summary>
      <img src={$SessionStore.user.user_metadata.picture} alt="Avatar" />
    </summary>
    <ul class="Google__profile--box CrispMenu__content" data-align="right">
      {#if getCustomClaim($SessionStore).role === Role.admin}
        <a
          href="/admin"
          class="CrispMenu__item Google__profile--item"
          data-icon={String.fromCharCode(61245)}
        >
          Admin Panel
        </a>
      {:else}
        <a
          href="/dash"
          class="CrispMenu__item Google__profile--item"
          data-icon={String.fromCharCode(59505)}
        >
          Dashboard
        </a>
        <a
          href="/dash/cart"
          class="CrispMenu__item Google__profile--item"
          data-icon={String.fromCharCode(59596)}
        >
          Cart
        </a>
      {/if}
      <form action="/auth?/logout" method="POST" class="w-100">
        <button type="submit" data-type="danger" class="CrispButton w-100"> Logout </button>
      </form>
    </ul>
  </details>
{/if}

<style lang="scss">
  .Google {
    &--button {
      gap: 10px;
      cursor: pointer;
      @include box(auto, 36px);

      & > span {
        font-size: 15px;
        white-space: nowrap;
      }

      &:hover {
        border: 1px solid var(--buttonHoverBorder);
        background-color: var(--buttonHoverBG) !important;
      }

      & > svg {
        @include box(20px, 20px);
      }
    }
    &__profile {
      @include box(36px, 36px);
      min-width: unset;
      & > summary {
        @include box();
        padding: 0;
        border-radius: 50%;

        & > img {
          border-radius: 50%;
          @include box(auto);
        }

        &::before {
          content: '';
        }
      }

      &--box {
        @include box(200px, auto);

        &[data-align='right'] {
          right: 0;
          &::after {
            right: 11px;
          }

          &::before {
            right: calc(11px + 0.5px);
          }
        }
      }

      &--item {
        gap: 8px;
        // padding: 8px;
        // display: grid;
        // align-items: center;
        // border-radius: 6px;
        text-decoration: none;
        // color: var(--foreground);
        // @include box($height: 36px);
        @include make-flex($dir: row, $just: flex-start);
        // transition: background-color 0.1s ease-in-out;
        // outline: none;

        &:not(.active):hover {
          background-color: #f3f4f6;
        }
      }
    }
  }
</style>
