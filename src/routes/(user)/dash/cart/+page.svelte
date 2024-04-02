<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;

	const { form, errors, enhance, constraints } = superForm(data.bookingForm, {
		id: 'bookingForm',
		dataType: 'json',
		taintedMessage: null
	});
</script>

<form method="POST" class="Cart" action="/dash?/booking" id="bookingForm" use:enhance>
	<section class="Cart__section">
		<header class="Cart__section--header">
			<h5>Booking Information</h5>
		</header>
		<div class="Cart__section--content">
			<!-- mentor - text -->
			<!-- description - text (course, our, research, etc) -->
			<!-- deadline for the project -->

			<label
				for="mentor"
				class="CrispLabel"
				data-direction="row"
				style="justify-content: space-between;"
			>
				<span style="color: inherit;" data-mandatory> Mentor </span>
				<div>
					<input
						id="mentor"
						type="text"
						name="mentor"
						class="CrispInput"
						bind:value={$form.mentor}
						{...$constraints.mentor}
						aria-invalid={$errors.mentor ? 'true' : undefined}
					/>
					{#if $errors.mentor}
						<p class="CrispMessage w-100" data-type="error">{$errors.mentor}</p>
					{/if}
				</div>
			</label>

			<label
				for="description"
				class="CrispLabel"
				data-direction="row"
				style="justify-content: space-between;"
			>
				<span style="color: inherit;" data-mandatory> Description </span>
				<div>
					<textarea
						id="description"
						name="description"
						class="CrispInput"
						data-type="text-area"
						placeholder="Tell us about your project...(Course, Research, etc)"
						bind:value={$form.description}
						aria-invalid={$errors.description ? 'true' : undefined}
						{...$constraints.description}
					></textarea>
					{#if $errors.description}
						<p class="CrispMessage w-100" data-type="error">{$errors.description}</p>
					{/if}
				</div>
			</label>

			<label
				for="deadline"
				class="CrispLabel"
				data-direction="row"
				style="justify-content: space-between;"
			>
				<span style="color: inherit;" data-mandatory> Deadline </span>
				<div>
					<input
						id="deadline"
						type="datetime-local"
						name="deadline"
						class="CrispInput"
						bind:value={$form.deadline}
						{...$constraints.deadline}
						aria-invalid={$errors.deadline ? 'true' : undefined}
					/>
					{#if $errors.deadline}
						<p class="CrispMessage w-100" data-type="error">{$errors.deadline}</p>
					{/if}
				</div>
			</label>
		</div>

		<footer class="Cart__section--footer">
			<button
				class="CrispButton"
				data-type="success"
				style="--crp-button-height: 25px;"
				form="bookingForm"
			>
				Book
			</button>
		</footer>
	</section>

	<h1>Cart</h1>

	<table class="FancyTable">
		<thead>
			<tr>
				<th> </th>
				<th> Instance Name </th>
				<th> Start time </th>
				<th> End time </th>
				<th> Cost </th>
				<th> View </th>
			</tr>
		</thead>
		<tbody>
			{#if data.cart}
				{#each data.cart.items as item}
					<tr>
						<td>
							<input type="checkbox" name="selectedItems" value={item.id} />
						</td>
						<td>{item.instance.name}</td>
						<td>{new Date(item.start).toLocaleString()}</td>
						<td>{new Date(item.end).toLocaleString()}</td>
						<td>{item.instance.cost}</td>
						<td>
							<a
								class="CrispButton"
								data-type="dark"
								target="_blank"
								rel="noopener noreferrer"
								href="/equipment/{item.instance.equipment.id}"
							>
								View
							</a>
						</td>
					</tr>
				{/each}
			{:else}
				<tr>
					<td colspan="5">No items in cart</td>
				</tr>
			{/if}
		</tbody>
		<tfoot>
			<tr>
				<td colspan="6">
					Showing {data.cart?.items.length ?? 0} result(s)
				</td>
			</tr>
		</tfoot>
	</table>
</form>

<style lang="scss">
	.Cart {
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
