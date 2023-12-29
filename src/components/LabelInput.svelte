<script lang="ts">
	export let { value, name } = $$props as {
		value: string;
		name: string;
	};
</script>

<label class="LabelInput" for={name}>
	<slot />
	<input bind:value {...$$restProps} id={name} {name} />
</label>

<style lang="scss">
	.LabelInput {
		gap: 11px;
		@include box(100%, auto);
		@include make-flex($align: flex-start);
		font-weight: 500;
		font-size: 16px;
		// line-height: 24px;

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
