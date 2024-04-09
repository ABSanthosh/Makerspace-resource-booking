<script lang="ts">
</script>

<div class="EventsLayout">
	<slot />
</div>

<style lang="scss">
	.EventsLayout {
		@include box();
		@include make-flex($just: flex-start);
	}
</style>
