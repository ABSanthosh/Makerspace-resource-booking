<script lang="ts">
	export let {
		value,
		name,
		error,
		mandatory,
		noFocus,
		orient = 'col'
	} = $$props as {
		value: string;
		name: string;
		mandatory?: boolean;
		error: string[] | undefined;
		noFocus?: boolean;
		orient?: 'col' | 'row';
	};
</script>

<label class="LabelInput {orient === 'col' ? 'Col--center' : 'Row--center'}" for={name}>
	<span class="LabelInput__text" data-mandatory={mandatory ? 'true' : undefined}>
		<slot />
	</span>
	{#if $$restProps.type === 'textarea'}
		<textarea
			{name}
			id={name}
			bind:value
			{...$$restProps}
			data-no-focus={noFocus ? undefined: 'true'}
		/>
	{:else}
		<input
			{name}
			id={name}
			bind:value
			{...$$restProps}
			data-no-focus={noFocus ? undefined: 'true'}
		/>
	{/if}
	{#if error && error.length > 0}
		<ul class="LabelInput__error">
			{#each error as err}
				<li>{err}</li>
			{/each}
		</ul>
	{/if}
</label>

<style lang="scss">
	.LabelInput {
		gap: 5px;
		@include box(100%, auto);
		align-items: flex-start;
		justify-content: space-between;
		// @include make-flex($align: flex-start);

		&__text {
			@include box(auto, auto);
			font-size: 14px;
			line-height: 20px;
			font-weight: 500;
			flex-wrap: nowrap;
			color: rgb(104, 112, 118);
			@include make-flex($dir: row, $align: flex-start);
		}
		// line-height: 24px;

		&__error {
			list-style-position: inside;
			& > li {
				color: var(--lightRed);
				font-size: 14px;
				font-weight: 500;
			}
		}

		& > input,
		& > textarea {
			@include box(var(--width, 100%), var(--height, 34px));
			padding: 1px var(--padxy, 14px);
			font-size: var(--font, 14px);
			border-radius: 7px;
			color: rgb(17, 24, 28);
			background-color: #05294d07;
			border: 1px solid #d4d8dc;
			outline: none;
			box-shadow:
				rgba(255, 255, 255, 0.035) 0px 0px 0px 0px,
				rgba(236, 238, 240, 0.035) 0px 0px 0px 0.0741246px,
				rgba(0, 0, 0, 0.05) 0px 1.11119px 2.14825px -0.0370623px,
				rgba(0, 0, 0, 0.004) 0px 0.0741246px 0.148249px -0.0741246px;

			&:focus,
			&:active {
				border: 1px solid #889096;
				box-shadow:
					rgba(0, 0, 0, 0) 0px 0px 0px 0px,
					rgb(236, 238, 240) 0px 0px 0px 2px,
					rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
					rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;
			}
			&:not([data-no-focus='true']) {
				&:focus {
					outline-offset: 2px;
					outline: 0.125rem solid #0054f0;
					transition: outline-offset 0.15s linear;
				}
			}
		}

		& > textarea {
			resize: none;
			padding: 10px var(--padxy, 14px) !important;
		}
	}
</style>
