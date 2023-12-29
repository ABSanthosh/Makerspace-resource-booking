<script lang="ts">
	import { enhance } from '$app/forms';
	import LabelInput from '$components/LabelInput.svelte';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';

	export let data: PageData;

	// Client form API:
	const { form, errors, constraints } = superForm(data.form);
</script>

<main class="Login">
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
</main>

<style lang="scss">
	.Login {
		@include box(100vw, 100vh);
		@include make-flex();

		& > form {
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
	}
</style>
