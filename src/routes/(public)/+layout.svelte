<script>
  import Header from '$components/Header.svelte';
  export let data;

  // This is the layout for all (public) group routes.
</script>

<Header pathname={data.pathname} />
<slot />
