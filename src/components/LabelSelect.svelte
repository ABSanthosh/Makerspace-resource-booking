<script lang="ts">
	export let { value, name, error, options, mandatory } = $$props as {
		value: string;
		name: string;
		options: string[];
		mandatory?: boolean;
		error: string[] | undefined;
	};
</script>

<label class="LabelSelect" for={name}>
	<span class="LabelSelect__text" data-mandatory={mandatory ? 'true' : undefined}>
		<slot title="label" />
	</span>
	<select
		{name}
		id={name}
		bind:value
		{...$$restProps}
		class="FancySelect"
		style="--height: 45px; width: 100%;"
	>
		{#each options as option}
			<option value={option}>{option}</option>
		{/each}
	</select>
	{#if error && error.length > 0}
		<ul class="LabelSelect__error">
			{#each error as err}
				<li>{err}</li>
			{/each}
		</ul>
	{/if}
</label>

<style lang="scss">
	.LabelSelect {
		gap: 11px;
		@include box(100%, auto);
		@include make-flex($align: flex-start);

		&__text {
			@include box(100%, auto);
			font-size: 16px;
			font-weight: 500;
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
	}
</style>
