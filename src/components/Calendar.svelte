<script lang="ts">
  import { CalendarView } from 'fluent-svelte';

  /**
   * @param {Date} value
   * @param {number} maxOffset - The maximum offset from the current month
   */
  export let {
    value,
    maxOffset = 1,
    blackout = []
  } = $$props as {
    value: Date | null;
    maxOffset: number;
    blackout: Date[];
  };

  $: today = new Date();
  $: min = today;
  $: max = new Date(today.getFullYear(), today.getMonth() + maxOffset, today.getDate());
</script>

<CalendarView bind:value bind:blackout {max} {min} />
