<script lang="ts">
	import { enhance } from '$app/forms';
	import LabelInput from '$components/LabelInput.svelte';
	import LabelSelect from '$components/LabelSelect.svelte';

	import type { RegisterSchema } from '$lib/schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import { UserCategory } from '@prisma/client';

	export let data: SuperValidated<RegisterSchema>;

	const { form, errors, constraints } = superForm(data, {
		clearOnSubmit: 'none'
	});
	const duration = 200;
	const delay = duration + 50;
	const x = 10;

	$: formStep = 1;
	const transitionIn = { easing: cubicOut, x: x, duration };
	const transitionOut = { easing: cubicIn, x: -x, duration, delay: -delay };
</script>

<SuperDebug data={$form} />

<form class="RegisterForm" method="post" use:enhance>
	<h2>Register</h2>
	{#key formStep}
		<!-- <div class="RegisterForm--box Col--center gap-15" out:fly={transitionOut} in:fly={transitionIn}> -->
		<!-- {#if formStep === 1} -->
		<div
			class="Col--center gap-15"
			out:fly={transitionOut}
			in:fly={transitionIn}
			style="display: {formStep === 1 ? 'flex' : 'none'}"
		>
			<h3 class="w-100">Personal information</h3>
			<div class="Row--between gap-15">
				<div class="RegisterForm__left Col--center w-50 gap-15">
					<LabelSelect
						mandatory
						name="userCategory"
						options={Object.keys(UserCategory)}
						{...$constraints.userCategory}
						bind:value={$form.userCategory}
						bind:error={$errors.userCategory}
						aria-invalid={$errors.userCategory ? 'true' : undefined}
					>
						User Category
					</LabelSelect>
					<div class="Row--between gap-10">
						<LabelInput
							mandatory
							name="firstName"
							type="text"
							{...$constraints.firstName}
							bind:value={$form.firstName}
							bind:error={$errors.firstName}
							aria-invalid={$errors.firstName ? 'true' : undefined}
						>
							First Name
						</LabelInput>
						<LabelInput
							mandatory
							name="lastName"
							type="text"
							{...$constraints.lastName}
							bind:value={$form.lastName}
							bind:error={$errors.lastName}
							aria-invalid={$errors.lastName ? 'true' : undefined}
						>
							Last Name
						</LabelInput>
					</div>
					<LabelInput
						mandatory
						name="orgName"
						type="text"
						{...$constraints.orgName}
						bind:value={$form.orgName}
						bind:error={$errors.orgName}
						aria-invalid={$errors.orgName ? 'true' : undefined}
					>
						Organization Name
					</LabelInput>
					<LabelSelect
						mandatory
						name="department"
						options={['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHER']}
						{...$constraints.department}
						bind:value={$form.department}
						bind:error={$errors.department}
						aria-invalid={$errors.department ? 'true' : undefined}
					>
						Department
					</LabelSelect>
				</div>
				<div class="RegisterForm__right Col--center w-50 gap-15">
					<LabelInput
						mandatory
						name="userId"
						type="text"
						{...$constraints.userId}
						bind:value={$form.userId}
						bind:error={$errors.userId}
						aria-invalid={$errors.userId ? 'true' : undefined}
					>
						Reg. No/Employee ID
					</LabelInput>
					<LabelInput
						mandatory
						name="mobile"
						type="text"
						{...$constraints.mobile}
						bind:value={$form.mobile}
						bind:error={$errors.mobile}
						aria-invalid={$errors.mobile ? 'true' : undefined}
					>
						Phone Number
					</LabelInput>
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
					<LabelSelect
						mandatory
						name="school"
						options={['School of Engineering', 'School of Science', 'School of Management']}
						{...$constraints.school}
						bind:value={$form.school}
						bind:error={$errors.school}
						aria-invalid={$errors.school ? 'true' : undefined}
					>
						School
					</LabelSelect>
				</div>
			</div>
			<div class="Row--j-end w-100">
				<button
					class="FancyButton"
					style="--height: 42px; width: 150px"
					data-type="black-fill"
					type="button"
					on:click={() => (formStep = 2)}
				>
					Next
				</button>
			</div>
			<span>
				Already have an account?
				<a href="/login">Log in</a>
			</span>
		</div>
		<!-- {:else if formStep === 2} -->
		<div
			class="Col--center gap-15"
			out:fly={transitionOut}
			in:fly={transitionIn}
			style="display: {formStep === 2 ? 'flex' : 'none'}"
		>
			<h3 class="w-100">Login credentials</h3>
			<div class="RegisterForm__center Col--j-start gap-10">
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
				<LabelInput
					mandatory
					name="confirmPassword"
					type="password"
					{...$constraints.email}
					bind:value={$form.confirm}
					bind:error={$errors.confirm}
					aria-invalid={$errors.confirm ? 'true' : undefined}
				>
					Confirm Password
				</LabelInput>
				<p class="w-100">Password must contain the following:</p>
				<ul class="RegisterForm__passRules w-100">
					<li>Must be at least 7 characters long</li>
					<li>Must contain at least one uppercase letter</li>
					<li>Must contain at least one lowercase letter</li>
					<li>Must contain at least one number</li>
					<li>Must contain at least one special character</li>
				</ul>
			</div>
			<div class="Row--between w-100 gap-10">
				<button
					class="FancyButton"
					style="--height: 42px; width: 100%"
					data-type="black-outline"
					type="button"
					on:click={() => (formStep = 1)}
				>
					Back
				</button>
				<button
					class="FancyButton"
					style="--height: 42px; width: 100%"
					data-type="black-fill"
					type="submit"
				>
					Register
				</button>
			</div>
			<span>
				Already have an account?
				<a href="/login">Log in</a>
			</span>
		</div>
		<!-- {/if} -->
		<!-- </div> -->
	{/key}
</form>

<style lang="scss">
	:global(.super-debug) {
		height: 250px;
		width: 500px;
		overflow-y: auto !important;
	}
	.RegisterForm {
		@include box(auto, $height: auto);
		min-width: 420px;
		// min-height: 520px;
		transition: all 0.5s ease-in-out;
		position: relative;
		overflow: hidden;

		& > h2 {
			@include box(100%, auto);
			font-size: 35px;
			font-weight: 600;
		}
		h3 {
			@include box(100%, auto);
			font-size: 22px;
			font-weight: 600;
		}

		&__left,
		&__right,
		&__center {
			@include box(380px, auto);
		}

		&__passRules {
			list-style-position: inside;
			padding: 0;
			margin: 0;
			font-size: 12px;
			color: #666;
			margin-top: 10px;
			li {
				margin-bottom: 5px;
			}
		}

		gap: 15px;
		@include make-flex();
		border-radius: 16px;
		background: #fff;
		box-shadow: 0px 11px 19.1px 11px rgba(0, 0, 0, 0.18);
		padding: 32px;
	}
</style>
