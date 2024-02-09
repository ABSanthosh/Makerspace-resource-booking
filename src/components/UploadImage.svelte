<script lang="ts">
	import { getStorageUrl } from '$lib/SupabaseUtils';

	let file: HTMLInputElement;

	export let { name, defaultVal, errors } = $$props as {
		name: string;
		defaultVal: string;
		errors: string[];
	};

	let preview: string | undefined;

	const onImageUpload = (e: Event) => {
		const target = e.target as HTMLInputElement;
		preview = URL.createObjectURL(target.files![0]);
	};
</script>

<label class="CrispLabel UploadImage" for={name}>
	<span data-mandatory style="color: inherit;"> Image </span>
	<div
		class="UploadImage__dnd"
		data-image={preview !== undefined || defaultVal !== '' ? true : undefined}
	>
		<input
			{name}
			id={name}
			type="file"
			bind:this={file}
			class="CrispInput"
			on:change={(e) => onImageUpload(e)}
		/>
		{#if preview || defaultVal !== ''}
			<img
				src={(defaultVal.includes('cache') ? getStorageUrl(defaultVal) : preview) ||
					getStorageUrl(defaultVal)}
				alt="Uploaded"
			/>
		{:else}
			Upload image
		{/if}
	</div>
	{#if errors}
		<ul class="CrispMessageList w-100" data-type="error">
			{#each errors as error}
				<li class="CrispMessageList__item">{error}</li>
			{/each}
		</ul>
	{/if}
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
