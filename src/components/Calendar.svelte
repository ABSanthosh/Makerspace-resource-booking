<script lang="ts">
	import { CalendarView } from 'fluent-svelte';

	export let { value = new Date() } = $$props as {
		value: Date;
	};
</script>

<CalendarView bind:value blackout={[new Date(2022, 2, 7), new Date(2022, 2, 9)]} />
