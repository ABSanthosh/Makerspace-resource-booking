<script lang="ts">
	export let { value, name, error, mandatory } = $$props as {
		value: string;
		name: string;
		mandatory?: boolean;
		error: string[] | undefined;
	};
</script>

<label class="LabelInput" for={name}>
	<span class="LabelInput__text" data-mandatory={mandatory ? 'true' : undefined}>
		<slot />
	</span>
	<input bind:value {...$$restProps} id={name} {name} />
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

		& > input {
			@include box(100%, 45px);
			padding: 1px 14px;
			font-size: 16px;
			border: 1px solid var(--border);
			border-radius: 7px;

			&:focus {
				outline-offset: 2px;
				outline: 0.125rem solid #0054f0;
				transition: outline-offset 0.15s linear;
			}
		}
	}
</style>
