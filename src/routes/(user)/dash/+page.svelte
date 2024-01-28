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
			<SuperDebug data={$profileForm} />
			<LabelInput
				style="max-width: 530px;"
				labelStyle="--width: 100%; gap: 15px"
				orient="row"
				disabled
				name="name"
				bind:value={$profileForm.name}
			>
				Name
			</LabelInput>
			<LabelInput
				style="max-width: 530px;"
				labelStyle="--width: 100%; gap: 15px"
				orient="row"
				disabled
				name="email"
				bind:value={$profileForm.email}
			>
				Email
			</LabelInput>
			<LabelInput
				style="max-width: 530px;"
				labelStyle="--width: 100%; gap: 15px"
				orient="row"
				name="mobile"
				bind:value={$profileForm.mobile}
				bind:error={$errors.mobile}
				aria-invalid={$profileForm.mobile ? 'true' : undefined}
			>
				Phone
			</LabelInput>
			<!-- branch -->
			<LabelInput
				style="max-width: 530px;"
				labelStyle="--width: 100%; gap: 15px"
				orient="row"
				name="branch"
				bind:value={$profileForm.branch}
				bind:error={$errors.branch}
				aria-invalid={$profileForm.branch ? 'true' : undefined}
			>
				Branch
			</LabelInput>
			<!-- department -->
			<LabelInput
				style="max-width: 530px;"
				labelStyle="--width: 100%; gap: 15px"
				orient="row"
				name="department"
				bind:value={$profileForm.department}
				bind:error={$errors.department}
				aria-invalid={$profileForm.department ? 'true' : undefined}
			>
				Department
			</LabelInput>
			<!-- year -->
			<LabelInput
				style="max-width: 530px;"
				labelStyle="--width: 100%; gap: 15px"
				orient="row"
				name="year"
				type="number"
				bind:value={$profileForm.year}
				bind:error={$errors.year}
				aria-invalid={$profileForm.year ? 'true' : undefined}
			>
				Year
			</LabelInput>
			<!-- rollno/ emp id-->
			<LabelInput
				style="max-width: 530px;"
				labelStyle="--width: 100%; gap: 15px"
				orient="row"
				name="userId"
				bind:value={$profileForm.userId}
				bind:error={$errors.userId}
				aria-invalid={$profileForm.userId ? 'true' : undefined}
			>
				Roll No. / Employee ID
			</LabelInput>
			<!-- TODO: add tagged inputs -->
		</form>
		<footer class="Dashboard__section--footer">
			<button class="FancyButton" form="userProfileForm">Save</button>
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
				padding: 16px 24px;
			}

			&--header {
				border-bottom: 1px solid #e6e8eb;
				& > h5 {
					font-size: 18px;
					font-weight: 500;
				}
			}

			&--content {
				gap: 15px;
				@include make-flex();
			}

			&--footer {
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
