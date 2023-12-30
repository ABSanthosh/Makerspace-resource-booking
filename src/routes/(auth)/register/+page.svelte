<script lang="ts">
	import RegisterForm from '$components/forms/RegisterForm.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<main class="Register">
	<RegisterForm data={data.form} />
</main>

<style lang="scss">
	.Register {
		@include box(100vw, 100vh);
		@include make-flex();
	}
</style>
