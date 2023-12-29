<script lang="ts">
	import { enhance } from '$app/forms';
	import LabelInput from '$components/LabelInput.svelte';
</script>

<main class="Register">
	<form method="post" use:enhance>
		<h2>Register</h2>
		<LabelInput name="email" type="email">Organizational Email</LabelInput>
		<LabelInput name="password" type="password">Password</LabelInput>

		<button
			class="FancyButton"
			style="--height: 42px; width: 100%"
			data-type="black-fill"
			type="submit">Register</button
		>
		<span>
			Already have an account?
			<a href="/login">Log in</a>
		</span>
	</form>
</main>

<style lang="scss">
	.Register {
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
