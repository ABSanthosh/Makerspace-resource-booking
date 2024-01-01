<script lang="ts">
	export let open = false;

	let pane: HTMLDialogElement;

	$: if (pane) {
		if (open) {
			pane.showModal();
		} else {
			pane.close();
		}
	}
</script>

<dialog
	class="Pane"
	{...$$restProps}
	bind:this={pane}
	on:keydown={(e) => {
		if (e.key === 'Escape') {
			pane.close();
			open = false;
		}
	}}
>
	<button
		class="Pane--close"
		on:click={() => {
			pane.close();
			open = false;
		}}
		data-icon={String.fromCharCode(58829)}
	/>
	{#if open}
		<slot />
	{/if}
</dialog>

<style lang="scss">
	.Pane {
		border: none;
		margin-top: 0;
		margin-right: 0;
		margin-bottom: 0;
		max-height: none;
		background-color: white;
		@include box(var(--width, 600px));

		&::backdrop {
			@include box(100vw, 100vh);
			backdrop-filter: blur(2px);
			background: rgba(0, 0, 0, 0.22);
		}

		&[open] {
			animation: slideIn 120ms ease-in-out;

			&::backdrop {
				animation: fadeIn 0.2s ease-out;
			}
		}

		&--close {
			top: 10px;
			right: 10px;
			padding: 6px;
			outline: none;
			cursor: pointer;
			background: none;
			border-radius: 5px;
			position: absolute;
			@include make-flex();
			@include box(25px, 25px);
			border: 1px solid #d0d7de;
			background-color: white;

			&:hover {
				background-color: var(--lightRed);

				&::before {
					color: white;
				}
			}
		}

		@keyframes slideIn {
			from {
				transform: translateX(100%);
			}
			to {
				transform: translateX(0);
			}
		}

		@keyframes fadeIn {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}
	}
</style>
