<script lang="ts">
  import { CMSStore } from '$store/SupaStore';

  const data = $CMSStore.find((item) => item.pathname === '/')?.data;
</script>

<section class="LocationCard">
  <div class="LocationCard__content">
    {@html data.location}
  </div>
  <span />
</section>

<style lang="scss">
  .LocationCard {
    @include box(100%, auto);
    min-height: 300px;
    display: grid;
    grid-template-columns: 55fr 40fr;
    overflow: hidden;
    border-radius: 28px;
    background: #fff;
    box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.08);
    position: relative;

    @include respondAt(1060px) {
      grid-template-columns: 55fr 30fr;
    }

    @include respondAt(970px) {
      grid-template-columns: 1fr;
    }
    @include respondAt(600px) {
      height: auto;
    }

    & > span {
      background-image: url('/assets/images/map.png');
      border-radius: 0 28px 28px 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;

      @include respondAt(970px) {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
      }
    }

    &__content {
      padding: 30px 40px;
      @include make-flex($align: flex-start, $just: flex-start);
      gap: 10px;
      z-index: 1;

      & > :global(h1) {
        font-size: 24px;
        font-weight: 600;
        line-height: 1.5;
      }

      & > :global(p) {
        font-size: 16px;
        line-height: 1.5;
        text-align: justify;
      }

      @include respondAt(970px) {
        background-color: #00000095;
        border-radius: 28px;
        backdrop-filter: blur(10px);
        & :global(*) {
          color: #fff;
        }
      }
    }

    :global(ul) {
      padding: 0 1rem;

      & :global(li) {
        line-height: 1.5;
      }
    }
  }
</style>
