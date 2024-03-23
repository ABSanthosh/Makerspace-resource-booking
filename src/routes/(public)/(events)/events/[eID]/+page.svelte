<script lang="ts">
	import type { PageData } from "./$types";
	import moment from "moment";

  export let data: PageData;
  $: ({ event } = data);
</script>

<div class="Event">
  <div class="Event__background">1</div>
  <section class="Event__content">
    <h1 class="Event__content--title">{event.name}</h1>
    <p class="Event__content--desc">{event.shortDescription}</p>
    <img src="/assets/images/event.png" alt="Event" class="Event__content--image"/>
    <div class="Event__content--author">
      <div class="Event__content--author-profile">
        <div class="Event__content--author-image"></div>
        {event.author.name}
      </div>
      <div class="Event__content--author-dates">
        <p>{moment(event.createdAt).format("MMMM Do, YYYY")}: Created</p>
        <p>{moment(event.updatedAt).format("MMMM Do, YYYY")}: Updated</p>
      </div>
    </div>
    <hr class="Event__content--divider">
    <p class="Event__content--paragraph">
      {event.description}
    </p>
  </section>
</div>


<style lang="scss">
  .Event {
    @include box($height: auto);
    @include make-flex();
    padding: 30px 20px 20px 20px;
    gap: 24px;
    position: relative;
    z-index: 0;

    &__background {
      position: absolute;
      background-color: #22272E;
      z-index: -1;
      height: 70vh;
      width: 100%;
      top: 0;
      left: 0;
    }

    &__content {
      padding: 30px 200px;
      max-width: $maxWidth;
      @include box(100%, auto);
      @include make-flex($just: flex-start, $align: flex-start, $dir: column);
      margin-top: 64px;
      gap: 24px;

      &--title {
        font-size: 36px;
        font-weight: 700;
        line-height: 1;
        text-align: left;
        color: white;
      }

      &--desc {
        font-size: 17px;
        line-height: 0.5;
        text-align: justify;
        color: #CBCBCB;
      }

      &--image {
        @include box();
      }

      &--author {
        @include make-flex($just: space-between, $dir: row);
        @include box();
        gap: 24px;

        &-profile {
          @include make-flex(row, center, flex-start);
          gap: 18px;
        }

        &-image {
          @include box(50px, 50px);
          border-radius: 50%;
          background-color: #FF6161;
        }

        &-dates {
          @include make-flex($just: flex-start, $align: flex-start, $dir: column);
          gap: 5px;

          p {
            font-size: 0.8rem;
            font-style: italic;
            color: #646464;
          }

        }
      }

      &--divider {
        width: 100%;
        border: 1px solid #CBCBCB;
      }

      &--paragraph {
        text-align: justify;
      }
    }
  }
</style>