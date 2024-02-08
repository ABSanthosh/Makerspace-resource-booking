<script lang="ts">
	import { SessionStore } from '$store/SupaStore';
	import LabelInput from '$components/LabelInput.svelte';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let data: PageData;
	$: ({ profileData } = data);
	$: console.log(profileData);

	$: user = $SessionStore!.user;

	const {
		form: profileForm,
		errors,
		enhance
	} = superForm(data.userProfileForm, {
		id: 'userProfileForm',
		dataType: 'json'
	});
</script>

<main class="Dashboard">
	<h1>
		Hello, {user.user_metadata.name}!
	</h1>
	<section class="Dashboard__section">
		<header class="Dashboard__section--header">
			<h5>Profile Information</h5>
		</header>
		<form
			use:enhance
			method="POST"
			action="?/update"
			id="userProfileForm"
			class="Dashboard__section--content"
		>
			<label
				for="name"
				class="CrispLabel"
				data-direction="row"
				style="justify-content: space-between;"
			>
				<span style="color: inherit;"> Name </span>
				<input
					disabled
					id="name"
					type="text"
					name="name"
					class="CrispInput"
					bind:value={$profileForm.name}
				/>
				{#if $errors.name}
					<ul class="CrispMessageList w-100" data-type="error">
						{#each $errors.name as error}
							<li class="CrispMessageList__item">{error}</li>
						{/each}
					</ul>
				{/if}
			</label>

			<label
				for="email"
				class="CrispLabel"
				data-direction="row"
				style="justify-content: space-between;"
			>
				<span style="color: inherit;"> Email </span>
				<input
					disabled
					id="email"
					type="email"
					name="email"
					class="CrispInput"
					bind:value={$profileForm.email}
				/>
				{#if $errors.email}
					<ul class="CrispMessageList w-100" data-type="error">
						{#each $errors.email as error}
							<li class="CrispMessageList__item">{error}</li>
						{/each}
					</ul>
				{/if}
			</label>

			<label
				for="mobile"
				class="CrispLabel"
				data-direction="row"
				style="justify-content: space-between;"
			>
				<span style="color: inherit;"> Phone </span>
				<input
					id="mobile"
					type="tel"
					name="mobile"
					class="CrispInput"
					bind:value={$profileForm.mobile}
				/>
				{#if $errors.mobile}
					<ul class="CrispMessageList w-100" data-type="error">
						{#each $errors.mobile as error}
							<li class="CrispMessageList__item">{error}</li>
						{/each}
					</ul>
				{/if}
			</label>

			<label
				for="branch"
				class="CrispLabel"
				data-direction="row"
				style="justify-content: space-between;"
			>
				<span style="color: inherit;"> Branch </span>
				<input
					id="branch"
					type="text"
					name="branch"
					class="CrispInput"
					bind:value={$profileForm.branch}
				/>
				{#if $errors.branch}
					<ul class="CrispMessageList w-100" data-type="error">
						{#each $errors.branch as error}
							<li class="CrispMessageList__item">{error}</li>
						{/each}
					</ul>
				{/if}
			</label>

			<label
				for="department"
				class="CrispLabel"
				data-direction="row"
				style="justify-content: space-between;"
			>
				<span style="color: inherit;"> Department </span>
				<input
					id="department"
					type="text"
					name="department"
					class="CrispInput"
					bind:value={$profileForm.department}
				/>
				{#if $errors.department}
					<ul class="CrispMessageList w-100" data-type="error">
						{#each $errors.department as error}
							<li class="CrispMessageList__item">{error}</li>
						{/each}
					</ul>
				{/if}
			</label>

			<label
				for="year"
				class="CrispLabel"
				data-direction="row"
				style="justify-content: space-between;"
			>
				<span style="color: inherit;"> Year </span>
				<input
					id="year"
					type="number"
					name="year"
					class="CrispInput"
					bind:value={$profileForm.year}
				/>
				{#if $errors.year}
					<ul class="CrispMessageList w-100" data-type="error">
						{#each $errors.year as error}
							<li class="CrispMessageList__item">{error}</li>
						{/each}
					</ul>
				{/if}
			</label>

			<label
				for="userId"
				class="CrispLabel"
				data-direction="row"
				style="justify-content: space-between;"
			>
				<span style="color: inherit;"> Roll No. / Employee ID </span>
				<input
					id="userId"
					type="text"
					name="userId"
					class="CrispInput"
					bind:value={$profileForm.userId}
				/>
				{#if $errors.userId}
					<ul class="CrispMessageList w-100" data-type="error">
						{#each $errors.userId as error}
							<li class="CrispMessageList__item">{error}</li>
						{/each}
					</ul>
				{/if}
			</label>

			<!-- TODO: add tagged inputs -->
		</form>
		<footer class="Dashboard__section--footer">
			<button
				class="CrispButton"
				data-type="success"
				style="--crp-button-height: 25px;"
				form="userProfileForm"
			>
				Save
			</button>
		</footer>
	</section>
</main>

<style lang="scss">
	.Dashboard {
		gap: 64px;
		padding: 16px;
		margin: 64px auto;
		max-width: $maxDashWidth;
		@include box($height: auto);
		@include make-flex($just: flex-start, $align: flex-start);

		& > h1 {
			font-size: 30px;
			font-weight: 500;
		}

		&__section {
			gap: 32px;
			width: 100%;
			border: 1px solid #e6e8eb;
			border-radius: 6px;
			box-shadow:
				#00000000 0px 0px 0px 0px,
				#00000000 0px 0px 0px 0px,
				#0000000d 0px 1px 2px 0px;
			@include make-flex($dir: column, $just: flex-start, $align: flex-start);

			&--header,
			&--footer {
				@include box($height: auto);
			}

			&--header {
				border-bottom: 1px solid #e6e8eb;
				padding: 16px 24px;
				& > h5 {
					font-size: 18px;
					font-weight: 500;
				}
			}

			&--content {
				gap: 15px;
				@include make-flex();

				.CrispLabel {
					&[data-direction='row'] {
						@include respondAt(620px) {
							flex-direction: column;
						}

						input {
							--crp-input-width: 60%;
							@include respondAt(620px) {
								flex-direction: column;
								--crp-input-width: 100%;
							}
						}
					}
				}
			}

			&--footer {
				padding: 13px 24px;
				border-top: 1px solid #e6e8eb;
				@include make-flex($dir: row, $just: flex-end);
			}

			& > *:not(&--header):not(&--footer) {
				@include box($height: auto);
				padding: 16px 24px;
				width: 100%;
			}
		}
	}
</style>
