<script lang="ts">
	// This is the layout for all the routes inside (equipment) group.
</script>

<div class="EquipmentLayout">
	<a href="/"> Home </a>
	<h1>Equipment Layout</h1>

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
