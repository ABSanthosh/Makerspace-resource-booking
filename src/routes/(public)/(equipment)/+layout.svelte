<script lang="ts">
	import BreadCrumb from '$components/BreadCrumb.svelte';
	import { BreadCrumbStore } from '$store/BreadCrumbStore';

	// This is the layout for all the routes inside (equipment) group.
</script>

<div class="EquipmentLayout">
	<BreadCrumb crumbs={$BreadCrumbStore} />
	<slot />
</div>

<style lang="scss">
	.EquipmentLayout {
		@include box($height: auto);
		@include make-flex($just: flex-start);
		padding: 30px 20px 20px 20px;
		margin-top: 64px;
		max-width: $maxWidth;
		gap: 15px;
	}
</style>
