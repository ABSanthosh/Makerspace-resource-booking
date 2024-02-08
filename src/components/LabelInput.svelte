<script lang="ts">
	export let {
		value,
		name,
		error,
		mandatory,
		noFocus,
		noLabel,
		orient = 'col',
		labelStyle
	} = $$props as {
		value: string;
		name: string;
		mandatory?: boolean;
		error: string[] | undefined;
		noFocus?: boolean;
		noLabel?: boolean;
		orient?: 'col' | 'row';
		labelStyle?: string;
	};
</script>

<label
	for={name}
	style={labelStyle}
	class="LabelInput {orient === 'col' ? 'LabelInput--col' : 'LabelInput--row'}"
>
	{#if !noLabel}
		<span class="LabelInput__text" data-mandatory={mandatory ? 'true' : undefined}>
			<slot />
		</span>
	{/if}
	{#if $$restProps.type === 'textarea'}
		<textarea
			class="FancyInput"
			{name}
			id={name}
			bind:value
			{...$$restProps}
			data-no-focus={noFocus ? undefined : 'true'}
		/>
	{:else}
		<input
			class="FancyInput"
			{name}
			id={name}
			bind:value
			{...$$restProps}
			data-no-focus={noFocus ? undefined : 'true'}
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
		@include box(var(--width, auto), auto);
		align-items: flex-start;
		justify-content: space-between;

		&--col {
			@include make-flex($dir: column, $just: center);
		}

		&--row {
			@include make-flex($dir: row, $just: space-between);
		}

		&__text {
			@include box(auto, auto);
			font-size: 14px;
			line-height: 20px;
			font-weight: 500;
			flex-wrap: nowrap;
			color: #687076;
			@include make-flex($dir: row, $align: flex-start);
		}

		&__error {
			list-style-position: inside;
			& > li {
				color: var(--lightRed);
				font-size: 14px;
				font-weight: 500;
			}
		}
	}
</style>
