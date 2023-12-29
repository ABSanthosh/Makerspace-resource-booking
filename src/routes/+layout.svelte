<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>SNU Makerspace</title>
	<meta charset="utf-8" />
	<meta
		content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"
		name="viewport"
	/>
</svelte:head>

{#if !$page.data.user}
	<a href="/login">Login</a>
	<a href="/register">Register</a>
{/if}
{#if $page.data.user}
	<a href="/dash">Dashboard</a>

	<form class="logout" action="/logout" method="POST" use:enhance>
		<button type="submit">Log out</button>
	</form>
{/if}
<slot />

<style lang="scss" global>
	@import '../styles/root/global.scss';
</style>
