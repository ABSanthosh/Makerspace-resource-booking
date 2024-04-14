<script lang="ts">
  import Sidebar from '$components/Sidebar.svelte';
  import { USER_ROUTES } from '$lib/routes';
  import type { Session } from '@supabase/supabase-js';
  import type { PageData } from './$types';

  export let data: PageData;
  $: ({ user } = data!.session || ({} as Session));
  $: isUserNew = user.app_metadata.custom_claims.isnew;
</script>

<main class="UserLayout">
  <Sidebar
    routes={isUserNew ? USER_ROUTES.filter((item) => item.name === 'Dashboard') : USER_ROUTES}
  />

  <div class="UserLayout__content">
    <slot />
  </div>
</main>

<style lang="scss">
  .UserLayout {
    @include box();
    display: grid;
    grid-template-columns: min-content 1fr;
    grid-template-areas: 'sidebar content';

    @include respondAt(845px) {
      grid-template-columns: 1fr;
      padding-left: 56px;
    }

    &__content {
      overflow: auto;
    }
  }
</style>
