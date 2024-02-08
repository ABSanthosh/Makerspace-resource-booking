<script lang="ts">
	let file: HTMLInputElement;

	export let { name, defaultVal } = $$props as {
		name: string;
		defaultVal?: string;
	};

	const onImageUpload = (e: Event) => {
		const target = e.target as HTMLInputElement;
		preview = URL.createObjectURL(target.files![0]);
	};

	let preview: string | undefined;
	$: preview = preview || defaultVal;
</script>

<label class="CrispLabel UploadImage" for={name}>
	<span data-mandatory style="color: inherit;"> Image </span>
	<div class="UploadImage__dnd" data-image={preview === undefined ? undefined : true}>
		<input
			{name}
			id={name}
			type="file"
			bind:this={file}
			class="CrispInput"
			on:change={(e) => onImageUpload(e)}
		/>
		{#if preview}
			<img src={preview} alt="Uploaded" />
		{:else}
			Upload image
		{/if}
	</div>
</label>

<style lang="scss">
	.UploadImage {
		gap: 11px;
		@include box($height: auto);
		@include make-flex($align: flex-start);

		&__dnd {
			padding: 5px;
			@include make-flex();
			color: var(--subText);
			@include box($height: 100px);

			cursor: pointer;
			border-radius: 7px;
			position: relative;
			border: 2px dashed var(--border);
			& > input {
				display: none;
			}

			& > img {
				max-width: 100%;
				max-height: 100%;
				border-radius: 3px;
				object-fit: contain;
			}
			&::before {
				inset: 0;
				opacity: 0;
				color: #fff;
				@include box();
				position: absolute;
				border-radius: 7px;
				@include make-flex();
				content: 'Change image';
				backdrop-filter: blur(0.5px);
				background: rgba(0, 0, 0, 0.5);
				transition: opacity 0.1s ease-in-out;
			}
			&[data-image]:hover::before {
				opacity: 1;
			}
		}
	}
</style>
