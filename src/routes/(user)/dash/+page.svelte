<script lang="ts">
  import { SessionStore } from '$store/SupaStore';
  import { ProfileType } from '@prisma/client';
  import type { PageData } from './$types';
  import { superForm } from 'sveltekit-superforms/client';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

  export let data: PageData;
  $: user = $SessionStore!.user;

  const {
    form: profileForm,
    errors,
    enhance,
    constraints
  } = superForm(data.userProfileForm, {
    id: 'userProfileForm',
    dataType: 'json',
    taintedMessage: null
  });

  $: isUserNew = user.app_metadata.custom_claims.isnew;
</script>

<main class="Dashboard">
  <h1>
    Hello, {user.user_metadata.name}!
  </h1>
  {#if isUserNew}
    <section class="Dashboard__warning">
      <h2>Please update your profile to continue using the app.</h2>
    </section>
  {/if}
  <section class="Dashboard__section">
    <header class="Dashboard__section--header">
      <h5>General Information</h5>
    </header>
    <form
      use:enhance
      method="POST"
      action="/dash?/update"
      id="userProfileForm"
      class="Dashboard__section--content"
    >
      <!-- <SuperDebug bind:data={$profileForm} /> -->
      <label
        for="name"
        class="CrispLabel"
        data-direction="row"
        style="justify-content: space-between;"
      >
        <span style="color: inherit;" data-mandatory> Name </span>
        <div>
          <input
            disabled
            id="name"
            type="text"
            name="name"
            class="CrispInput"
            bind:value={$profileForm.name}
            {...$constraints.name}
          />
          {#if $errors.name}
            <p class="CrispMessage w-100" data-type="error">
              {$errors.name}
            </p>
          {/if}
        </div>
      </label>

      <label
        for="email"
        class="CrispLabel"
        data-direction="row"
        style="justify-content: space-between;"
      >
        <span style="color: inherit;" data-mandatory> Email </span>
        <div>
          <input
            disabled
            id="email"
            type="email"
            name="email"
            class="CrispInput"
            bind:value={$profileForm.email}
            {...$constraints.email}
          />
          {#if $errors.email}
            <p class="CrispMessage w-100" data-type="error">
              {$errors.email}
            </p>
          {/if}
        </div>
      </label>

      <label
        for="mobile"
        class="CrispLabel"
        data-direction="row"
        style="justify-content: space-between;"
      >
        <span style="color: inherit;" data-mandatory> Phone </span>
        <div>
          <input
            id="mobile"
            type="tel"
            name="mobile"
            class="CrispInput"
            placeholder="9999999999"
            bind:value={$profileForm.mobile}
            {...$constraints.mobile}
          />
          {#if $errors.mobile}
            <p class="CrispMessage w-100" data-type="error">
              {$errors.mobile}
            </p>
          {/if}
        </div>
      </label>

      <label
        for="profileType"
        class="CrispLabel"
        data-direction="row"
        style="justify-content: space-between;"
      >
        <span style="color: inherit;" data-mandatory> Category </span>
        <div>
          <select class="CrispSelect w-100" bind:value={$profileForm.type} {...$constraints.type}>
            <option value={ProfileType.STUDENT}>Student</option>
            <option value={ProfileType.FACULTY}>Faculty</option>
            <option value={ProfileType.STAFF}>Staff</option>
          </select>
          {#if $errors.type}
            <p class="CrispMessage w-100" data-type="error">
              {$errors.type}
            </p>
          {/if}
        </div>
      </label>
      <hr />
      {#if $profileForm.type === ProfileType.STUDENT}
        <label
          for="yearOfStudy"
          class="CrispLabel"
          data-direction="row"
          style="justify-content: space-between;"
        >
          <span style="color: inherit;" data-mandatory> Year of Study </span>
          <div>
            <input
              id="yearOfStudy"
              type="number"
              name="yearOfStudy"
              class="CrispInput"
              bind:value={$profileForm.typeData.yearOfStudy}
            />
            <!-- {...$constraints.typeData} -->
            {#if $errors.typeData?.yearOfStudy}
              <p class="CrispMessage w-100" data-type="error">
                {$errors.typeData?.yearOfStudy}
              </p>
            {/if}
          </div>
        </label>
        <label
          for="branch"
          class="CrispLabel"
          data-direction="row"
          style="justify-content: space-between;"
        >
          <span style="color: inherit;" data-mandatory> Branch </span>
          <div>
            <input
              id="branch"
              type="text"
              name="branch"
              class="CrispInput"
              bind:value={$profileForm.typeData.branch}
            />
            <!-- {...$constraints.typeData?.branch} -->
            {#if $errors.typeData?.branch}
              <p class="CrispMessage w-100" data-type="error">
                {$errors.typeData?.branch}
              </p>
            {/if}
          </div>
        </label>
        <label
          for="department"
          class="CrispLabel"
          data-direction="row"
          style="justify-content: space-between;"
        >
          <span style="color: inherit;" data-mandatory> Department </span>
          <div>
            <input
              id="department"
              type="text"
              name="department"
              class="CrispInput"
              bind:value={$profileForm.typeData.department}
            />
            <!-- {...$constraints.typeData?.department} -->
            {#if $errors.typeData?.department}
              <p class="CrispMessage w-100" data-type="error">
                {$errors.typeData?.department}
              </p>
            {/if}
          </div>
        </label>
        <label
          for="studentId"
          class="CrispLabel"
          data-direction="row"
          style="justify-content: space-between;"
        >
          <span style="color: inherit;" data-mandatory> Student ID </span>
          <div>
            <input
              id="studentId"
              type="text"
              name="studentId"
              class="CrispInput"
              bind:value={$profileForm.typeData.studentId}
            />
            {#if $errors.typeData?.studentId}
              <p class="CrispMessage w-100" data-type="error">
                {$errors.typeData?.studentId}
              </p>
            {/if}
          </div>
        </label>
        <label
          for="clubs"
          class="CrispLabel"
          data-direction="row"
          style="justify-content: space-between;"
        >
          <span style="color: inherit;"> Clubs </span>
          <div>
            <input
              id="clubs"
              type="text"
              name="clubs"
              class="CrispInput"
              bind:value={$profileForm.typeData.clubs}
            />
            <!-- {...$constraints.typeData?.clubs} -->
            {#if $errors.typeData?.clubs}
              <p class="CrispMessage w-100" data-type="error">
                {$errors.typeData?.clubs}
              </p>
            {/if}
          </div>
        </label>
      {:else if $profileForm.type === ProfileType.FACULTY}
        <label
          for="department"
          class="CrispLabel"
          data-direction="row"
          style="justify-content: space-between;"
        >
          <span style="color: inherit;" data-mandatory> Department </span>
          <div>
            <input
              id="department"
              type="text"
              name="department"
              class="CrispInput"
              bind:value={$profileForm.typeData.department}
            />
            <!-- {...$constraints.typeData?.department} -->
            {#if $errors.typeData?.department}
              <p class="CrispMessage w-100" data-type="error">
                {$errors.typeData?.department}
              </p>
            {/if}
          </div>
        </label>
        <label
          for="branch"
          class="CrispLabel"
          data-direction="row"
          style="justify-content: space-between;"
        >
          <span style="color: inherit;" data-mandatory> Branch </span>
          <div>
            <input
              id="branch"
              type="text"
              name="branch"
              class="CrispInput"
              bind:value={$profileForm.typeData.branch}
            />
            <!-- {...$constraints.typeData?.branch} -->
            {#if $errors.typeData?.branch}
              <p class="CrispMessage w-100" data-type="error">
                {$errors.typeData?.branch}
              </p>
            {/if}
          </div>
        </label>
        <label
          for="designation"
          class="CrispLabel"
          data-direction="row"
          style="justify-content: space-between;"
        >
          <span style="color: inherit;" data-mandatory> Designation </span>
          <div>
            <input
              id="designation"
              type="text"
              name="designation"
              class="CrispInput"
              bind:value={$profileForm.typeData.designation}
            />
            <!-- {...$constraints.typeData?.designation} -->
            {#if $errors.typeData?.designation}
              <p class="CrispMessage w-100" data-type="error">
                {$errors.typeData?.designation}
              </p>
            {/if}
          </div>
        </label>
        <label
          for="facultyId"
          class="CrispLabel"
          data-direction="row"
          style="justify-content: space-between;"
        >
          <span style="color: inherit;" data-mandatory> Faculty ID </span>
          <div>
            <input
              id="facultyId"
              type="text"
              name="facultyId"
              class="CrispInput"
              bind:value={$profileForm.typeData.facultyId}
            />
            <!-- {...$constraints.typeData?.facultyId} -->
            {#if $errors.typeData?.facultyId}
              <p class="CrispMessage w-100" data-type="error">
                {$errors.typeData?.facultyId}
              </p>
            {/if}
          </div>
        </label>
      {:else if $profileForm.type === ProfileType.STAFF}
        <label
          for="department"
          class="CrispLabel"
          data-direction="row"
          style="justify-content: space-between;"
        >
          <span style="color: inherit;" data-mandatory> Department </span>
          <div>
            <input
              id="department"
              type="text"
              name="department"
              class="CrispInput"
              bind:value={$profileForm.typeData.department}
            />
            <!-- {...$constraints.typeData?.department} -->
            {#if $errors.typeData?.department}
              <p class="CrispMessage w-100" data-type="error">
                {$errors.typeData?.department}
              </p>
            {/if}
          </div>
        </label>
        <label
          for="branch"
          class="CrispLabel"
          data-direction="row"
          style="justify-content: space-between;"
        >
          <span style="color: inherit;" data-mandatory> Branch </span>
          <div>
            <input
              id="branch"
              type="text"
              name="branch"
              class="CrispInput"
              bind:value={$profileForm.typeData.branch}
            />
            <!-- {...$constraints.typeData?.branch} -->
            {#if $errors.typeData?.branch}
              <p class="CrispMessage w-100" data-type="error">
                {$errors.typeData?.branch}
              </p>
            {/if}
          </div>
        </label>
        <label
          for="designation"
          class="CrispLabel"
          data-direction="row"
          style="justify-content: space-between;"
        >
          <span style="color: inherit;" data-mandatory> Designation </span>
          <div>
            <input
              id="designation"
              type="text"
              name="designation"
              class="CrispInput"
              bind:value={$profileForm.typeData.designation}
            />
            <!-- {...$constraints.typeData?.designation} -->
            {#if $errors.typeData?.designation}
              <p class="CrispMessage w-100" data-type="error">
                {$errors.typeData?.designation}
              </p>
            {/if}
          </div>
        </label>
        <label
          for="staffId"
          class="CrispLabel"
          data-direction="row"
          style="justify-content: space-between;"
        >
          <span style="color: inherit;" data-mandatory> Staff ID </span>
          <div>
            <input
              id="staffId"
              type="text"
              name="staffId"
              class="CrispInput"
              bind:value={$profileForm.typeData.staffId}
            />
            <!-- {...$constraints.typeData?.staffId} -->
            {#if $errors.typeData?.staffId}
              <p class="CrispMessage w-100" data-type="error">
                {$errors.typeData?.staffId}
              </p>
            {/if}
          </div>
        </label>
      {:else}
        <p>Choose a category to update the form.</p>
      {/if}
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
  <!-- <section class="Dashboard__section">
		<header class="Dashboard__section--header">
			<h5>User specific Information</h5>
		</header>
		<form
			use:enhance
			method="POST"
			action="/dash?/update"
			id="updateTypeDataForm"
			class="Dashboard__section--content"
		>
		
		</form>

		<footer class="Dashboard__section--footer">
			<button
				class="CrispButton"
				data-type="success"
				style="--crp-button-height: 25px;"
				form="updateTypeDataForm"
			>
				Save
			</button>
		</footer>
	</section> -->
</main>

<style lang="scss">
  .Dashboard {
    gap: 24px;
    padding: 16px;
    margin: 64px auto;
    max-width: $maxDashWidth;
    @include box($height: auto);
    @include make-flex($just: flex-start, $align: flex-start);

    & > h1 {
      font-size: 30px;
      font-weight: 500;
    }

    &__warning {
      padding: 16px 24px;
      border: 1px solid var(--lightRed);
      border-radius: 6px;
      @include box($height: auto);
      background-color: var(--paleRed);
      & > h2 {
        gap: 8px;
        font-size: 18px;
        font-weight: 500;
        color: var(--darkRed);
        @include make-flex($dir: row, $just: flex-start, $align: flex-start);
        &::before {
          content: '';
          @include box(22px, 22px);
          background-size: contain;
          background-repeat: no-repeat;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='23' height='21' viewBox='0 0 23 21' fill='none'%3E%3Cpath d='M11.9999 7.99998V12M11.9999 16H12.0099M21.7299 17L13.7299 2.99998C13.5555 2.69218 13.3025 2.43617 12.9969 2.25805C12.6912 2.07993 12.3437 1.98608 11.9899 1.98608C11.6361 1.98608 11.2887 2.07993 10.983 2.25805C10.6773 2.43617 10.4244 2.69218 10.2499 2.99998L2.24993 17C2.07361 17.3053 1.98116 17.6519 1.98194 18.0045C1.98272 18.3571 2.07671 18.7032 2.25438 19.0078C2.43204 19.3124 2.68708 19.5646 2.99362 19.7388C3.30017 19.9131 3.64734 20.0032 3.99993 20H19.9999C20.3508 19.9996 20.6955 19.9069 20.9992 19.7313C21.303 19.5556 21.5551 19.3031 21.7304 18.9991C21.9057 18.6951 21.998 18.3504 21.9979 17.9995C21.9978 17.6486 21.9054 17.3039 21.7299 17Z' stroke='%23FF605C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        }
      }
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

      hr {
        border: 0;
        border-top: 1px solid #e6e8eb;
        width: 100%;
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
          & > div {
            gap: 10px;
            width: 60%;
            @include make-flex();
            @include respondAt(620px) {
              width: 100%;
            }
          }
          &[data-direction='row'] {
            @include respondAt(620px) {
              flex-direction: column;
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
