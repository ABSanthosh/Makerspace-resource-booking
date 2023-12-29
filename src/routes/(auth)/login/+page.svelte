<script lang="ts">
	import LoginForm from '$components/forms/LoginForm.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<main class="Login">
	<LoginForm data={data.form} />
</main>

<style lang="scss">
	.Login {
		@include box(100vw, 100vh);
		@include make-flex();
	}
</style>
