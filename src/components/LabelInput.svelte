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
			data-no-focus={noFocus ? 'true' : undefined}
		/>
	{:else}
		<input
			{name}
			id={name}
			bind:value
			{...$$restProps}
			data-no-focus={noFocus ? 'true' : undefined}
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
		gap: 11px;
		@include box(100%, auto);
		align-items: flex-start;
		justify-content: space-between;
		// @include make-flex($align: flex-start);

		&__text {
			@include box(auto, auto);
			font-size: 16px;
			font-weight: 500;
			flex-wrap: nowrap;
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
			@include box(var(--width, 100%), var(--height, 45px));
			padding: 1px var(--padxy, 14px);
			font-size: var(--font, 16px);
			border: 1px solid var(--border);
			border-radius: 7px;

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
