<script lang="ts">
	import type { HTMLDialogAttributes } from 'svelte/elements';
	interface $$restProps extends HTMLDialogAttributes {}

	export let { open = false, className } = $$props as {
		open: boolean;
		className?: string;
	};

	let pane: HTMLDialogElement;

	$: if (pane) {
		if (open) {
			pane.showModal();
			document.documentElement.style.scrollbarGutter = 'unset';
			document.documentElement.style.overflow = 'hidden';
		} else {
			pane.close();
			document.documentElement.style.scrollbarGutter = '';
			document.documentElement.style.overflow = '';
		}
	}
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
	class="Pane"
	{...$$restProps}
	bind:this={pane}
	on:close
	on:keydown={(e) => {
		if (e.key === 'Escape') {
			pane.close();
			open = false;
		}
	}}
	on:click|self={() => {
		pane.close();
		open = false;
	}}
>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation>
		<header>
			<slot name="header" />
			<button
				class="Pane--close"
				on:click={() => {
					pane.close();
					open = false;
				}}
				data-icon={String.fromCharCode(58829)}
			/>
		</header>
		{#if $$slots.main}
			<main>
				<slot name="main" />
			</main>
		{:else}
			<slot name="free" />
		{/if}
		{#if $$slots.footer}
		<footer>
			<slot name="footer" />
		</footer>
		{/if}
	</div>
</dialog>

<style lang="scss">
	.Pane {
		&__backdrop {
			top: 0;
			left: 0;
			z-index: -1;
			position: fixed;
			@include box(100vw, 100vh);
		}

		margin-top: 0;
		margin-right: 0;
		margin-bottom: 0;
		border: none;
		@include box(var(--paneWidth, 600px), 100vh);

		max-width: none;
		max-height: none;
		overflow: hidden;
		& > div {
			z-index: 1;
			background-color: #fbfcfd;
			border-left: 1px solid var(--border);
			box-shadow:
				rgba(0, 0, 0, 0) 0px 0px 0px 0px,
				rgba(0, 0, 0, 0) 0px 0px 0px 0px,
				rgba(0, 0, 0, 0.1) 0px 20px 25px -5px,
				rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
			@include box(auto, 100vh);
			@include make-flex();
			outline: none;

			@include respondAt(600px) {
				@include box(100vw);
			}
			// @include box();
			& > header {
				@include box(100%, auto);
				padding: 16px 24px;
				@include make-flex($align: flex-start);
				border-bottom: 1px solid var(--border);
				position: relative;
			}

			& > main {
				@include box(100%, auto);
				padding: 24px;
				flex: 1 1 0%;
				overflow-y: auto;
			}

			& > footer {
				@include box(100%, auto);
				padding: 12px 16px;
				@include make-flex($align: flex-end);
				border-top: 1px solid var(--border);
			}
		}

		&::backdrop {
			@include box(100vw, 100vh);
			backdrop-filter: blur(1px);
			background: rgba(240, 242, 244, 75%);
		}

		&[open] {
			animation: slideIn 0.2s cubic-bezier(0.87, 0, 0.13, 1);

			&::backdrop {
				animation: fadeIn 0.2s ease-out;
			}
		}

		&--close {
			top: 50%;
			transform: translateY(-50%);
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
