<script lang="ts">
	import { enhance } from '$app/forms';
	import LabelInput from '$components/LabelInput.svelte';

	import type { LoginSchema } from '$lib/schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	export let data: SuperValidated<LoginSchema>;

	const { form, errors, constraints } = superForm(data);
</script>

<form method="post" use:enhance>
	<h2>Login</h2>
	<LabelInput
		mandatory
		name="email"
		type="email"
		{...$constraints.email}
		bind:value={$form.email}
		bind:error={$errors.email}
		aria-invalid={$errors.email ? 'true' : undefined}
	>
		Organizational Email
	</LabelInput>
	<LabelInput
		mandatory
		name="password"
		type="password"
		{...$constraints.email}
		bind:value={$form.password}
		bind:error={$errors.password}
		aria-invalid={$errors.password ? 'true' : undefined}
	>
		Password
	</LabelInput>
	<button
		class="FancyButton"
		style="--height: 42px; width: 100%"
		data-type="black-fill"
		type="submit">Login</button
	>
	<span>
		Don't have an account?
		<a href="/register">Create an account</a>
	</span>
</form>

<style lang="scss">
	form {
		@include box(420px, auto);
		& > h2 {
			@include box(100%, auto);
			font-size: 35px;
			font-weight: 600;
		}

		gap: 15px;
		@include make-flex();
		border-radius: 16px;
		background: #fff;
		box-shadow: 0px 11px 19.1px 11px rgba(0, 0, 0, 0.18);
		padding: 32px;
	}
</style>
