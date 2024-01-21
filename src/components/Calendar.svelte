<script lang="ts">
	import { CalendarView } from 'fluent-svelte';

	export let { value = new Date() } = $$props as {
		value: Date;
	};
</script>

<CalendarView bind:value blackout={[new Date(2022, 2, 7), new Date(2022, 2, 9)]} />

<style lang="scss">
	:global(.calendar-view) {
		:global(.calendar-view-header-text > button) {
			cursor: pointer;
		}
		:global(.calendar-view-pagination-controls > button) {
			cursor: pointer;
		}
		:global(.calendar-view-item) {
			cursor: pointer;
		}

		// Out of range
		--fds-text-secondary: #7f7f81;
		--fds-control-corner-radius: 7px;
		--fds-accent-default: #0078d4;
		--fds-accent-secondary: #106ebe;
		--fds-text-on-accent-primary: #ffffff;
		--fds-subtle-fill-secondary: #e0e0e0;
		// --fds-subtle-fill-transparent: #e30000;

		@include box(100% !important, $height: auto);
		:global(.calendar-view-table-wrapper) {
			@include box(100% !important, $height: auto);
		}
	}
</style>
