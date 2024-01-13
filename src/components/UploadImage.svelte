<script lang="ts">
	let file: HTMLInputElement;

	export let imageSrc: string;

	const onImageUpload = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const file = target.files![0];

		const reader = new FileReader();
		reader.onload = (e) => {
			imageSrc = e.target!.result as string;
		};
		reader.readAsDataURL(file);
	};
</script>

<div class="UploadImage">
	<span>Image</span>
	<label
		for="image-upload"
		class="UploadImage__dnd"
		data-image={imageSrc === '' ? undefined : true}
	>
		<input
			type="file"
			id="image-upload"
			accept=".jpg, .jpeg, .png"
			on:change={(e) => onImageUpload(e)}
			bind:this={file}
		/>
		{#if imageSrc}
			<img src={imageSrc} alt="Uploaded" />
		{:else}
			Upload image
		{/if}
	</label>
	<!-- style="display:none" -->
</div>

<style lang="scss">
	.UploadImage {
		@include box($height: auto);
		gap: 11px;
		@include make-flex($align: flex-start);

		&__dnd {
			@include box($height: 100px);
			@include make-flex();
			color: var(--subText);
			padding: 5px;

			border: 2px dashed var(--border);
			border-radius: 7px;
			cursor: pointer;
			position: relative;
			& > input {
				display: none;
			}

			& > img {
				max-height: 100%;
				max-width: 100%;
				object-fit: contain;
				border-radius: 3px;
			}
			&::before {
				content: 'Change image';
				@include make-flex();
				@include box();
				position: absolute;
				inset: 0;
				background: rgba(0, 0, 0, 0.5);
				border-radius: 7px;
				backdrop-filter: blur(0.5px);
				// display: none;
				opacity: 0;
				transition: opacity 0.1s ease-in-out;
				color: #fff;
			}
			&[data-image]:hover::before {
				// display: flex;
				opacity: 1;
			}
		}
	}
</style>
