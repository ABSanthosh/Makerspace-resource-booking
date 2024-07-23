<script lang="ts">
  import BreadCrumb from '$components/BreadCrumb.svelte';
  import { BreadCrumbStore, isEquipmentDeletedStore } from '$store/BreadCrumbStore';
</script>

<div class="EventsLayout">
  <slot />
</div>

<style lang="scss">
  .EventsLayout {
    @include box($height: auto);
    @include make-flex($just: flex-start);
  }
</style>
