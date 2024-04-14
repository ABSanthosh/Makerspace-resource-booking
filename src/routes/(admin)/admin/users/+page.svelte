<script lang="ts">
  import { applyAction, enhance } from '$app/forms';
  import clickOutside from '$directive/clickOutside';
  import { addToast } from '$store/ToastStore';
  import type { PageData } from './$types';

  export let data: PageData;

  $: userOptionMenu = '';
</script>

<main class="UsersPage">
  <table class="FancyTable">
    <thead>
      <tr>
        <th> Name </th>
        <th> Email </th>
        <th> Role </th>
        <th> Mobile </th>
        <th> </th>
      </tr>
    </thead>
    <tbody>
      {#if data.allUsers && data.allUsers.length > 0}
        {#each data.allUsers as item}
          <tr>
            <td class:blacklisted={item.isBlacklisted}> {item.name} </td>
            <td> {item.email} </td>
            <td> {item.role} </td>
            <td> {item.mobile === '' ? '-' : item.mobile} </td>
            <td>
              <details
                data-no-marker
                use:clickOutside
                open={userOptionMenu === item.id}
                class="CrispMenu UsersPage__content--menu"
                on:outclick={() => {
                  userOptionMenu = '';
                  return false;
                }}
              >
                <summary>
                  <button
                    class="CrispButton"
                    data-icon={String.fromCharCode(58835)}
                    style="--crp-button-height: 24px; 
												--crp-button-width: auto; 
												--crp-button-padding-left: 6px; 
												--crp-button-padding-right: 6px;"
                    data-type="ghost"
                    on:click={() => (userOptionMenu = item.id)}
                  />
                </summary>
                <ul
                  class="UsersPage__content--box CrispMenu__content"
                  data-align="top"
                  data-direction="left"
                >
                  <form
                    use:enhance={() => {
                      return async ({ result, update }) => {
                        if (result.status === 200) {
                          addToast({
                            message: `User ${
                              item.isBlacklisted ? 'un-blacklisted' : 'blacklisted'
                            } successfully`,
                            type: 'success'
                          });
                        } else {
                          addToast({
                            message: `Failed to ${
                              item.isBlacklisted ? 'un-blacklist' : 'blacklist'
                            } user`,
                            type: 'danger'
                          });
                        }

                        update();
                      };
                    }}
                    method="POST"
                    class="w-100"
                    action="/admin/users?/{item.isBlacklisted ? 'unblacklist' : 'blacklist'}"
                  >
                    <input type="hidden" name="userId" value={item.id} />
                    <button
                      type="submit"
                      data-border="false"
                      class="CrispButton"
                      disabled={data.currentUserId === item.id || item.role === 'admin'}
                      title={data.currentUserId === item.id
                        ? 'You cannot blacklist yourself'
                        : item.role === 'admin'
                          ? 'You cannot blacklist an admin'
                          : ''}
                    >
                      {item.isBlacklisted ? 'Un-blacklist' : 'Blacklist'}
                    </button>
                  </form>
                </ul>
              </details>
            </td>
          </tr>
        {/each}
      {:else}
        <tr class="empty">
          <td colspan="5">
            <i class="CrispMessage" data-type="error" data-format="box"> No results found </i>
          </td>
        </tr>
      {/if}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="5">
          Showing {data.allUsers?.length ?? 0} result(s)
        </td>
      </tr>
    </tfoot>
  </table>
</main>

<style lang="scss">
  .UsersPage {
    gap: 24px;
    padding: 24px;
    @include box();
    @include make-flex($just: flex-start);
    max-width: $maxDashWidth;

    &__content {
      &--box {
        @include box(150px, auto);

        button {
          width: 100%;
        }
      }
      &--menu {
        min-width: unset;
        @include box(34px, 24px);
        --crp-menu-offset: 4px;
        & > summary {
          @include box(34px, 24px);
          border: 1px solid transparent;
          box-shadow: 0px 0px 0px transparent;
          padding: 0;

          &:hover {
            background-color: transparent;
          }

          &::before {
            content: '';
          }
        }
      }
    }

    .FancyTable {
      td {
        position: relative;
      }
      .blacklisted {
        &::after {
          top: 50%;
          left: 10px;
          content: '';
          border-radius: 50%;
          position: absolute;
          @include box(8px, 8px);
          transform: translateY(-50%);
          background-color: var(--lightRed);
        }
      }
    }
  }
</style>
