<script lang="ts">
  import HomeNavigation from '$components/HomeNavigation.svelte';
  import Google from '$components/Google.svelte';

  export let { pathname } = $$props as {
    pathname: string;
  };
</script>

<header class="HeaderWrapper">
  <div class="Header">
    <div class="Header__left">
      <a href="/" class="Header__logo">
        <img src="/assets/images/snu_logo.svg" alt="snu Logo" />
        <hr />
        <img src="/assets/images/logo.svg" alt="Logo" />
      </a>
    </div>
    <div class="Header__right">
      <HomeNavigation {pathname} isHeader={true} />
      <Google />
    </div>
  </div>
</header>

<style lang="scss">
  .HeaderWrapper {
    top: 0;
    left: 0;
    right: 0;
    gap: 10px;
    z-index: 5;
    position: fixed;
    @include box(100%, 64px);
    background: #ffffff;
    box-shadow: 0px 4px 14px 0px rgba(0, 0, 0, 0.06);
    backdrop-filter: blur(5px);
    @include make-flex();
  }
  .Header {
    align-items: center;
    @include box();
    max-width: $maxWidth;
    @include make-flex($dir: row, $just: space-between);
    gap: 15px;
    padding: 16px 20px;

    &__logo {
      @include make-flex($dir: row, $just: flex-start, $align: center);
      gap: 10px;
      @include box(auto);
      & > img {
        @include box(auto, 35px);

        &:first-child {
          @include respondAt(500px) {
            display: none;
          }
        }
      }
      & > hr {
        @include box(1px, 40px);
        background: var(--iconColor);
        border: none;
        @include respondAt(500px) {
          display: none;
        }
      }
    }

    &__left {
      @include make-flex($dir: row, $just: flex-start);
      @include box(auto, auto);
    }

    &__right {
      @include make-flex($dir: row, $just: flex-end);
      @include box(100%, auto);
    }

    &__right,
    &__left {
      gap: 15px;
    }
  }
</style>
