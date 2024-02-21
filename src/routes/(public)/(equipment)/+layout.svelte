<script lang="ts">
	import BreadCrumb from '$components/BreadCrumb.svelte';
	import { BreadCrumbStore, isEquipmentDeletedStore } from '$store/BreadCrumbStore';
	import { onMount } from 'svelte';
	import type { PageData } from './equipment/$types';

	// This is the layout for all the routes inside (equipment) group.
</script>

<div class="EquipmentLayout">
	<BreadCrumb type={$isEquipmentDeletedStore ? 'disabled' : undefined} crumbs={$BreadCrumbStore} />
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
