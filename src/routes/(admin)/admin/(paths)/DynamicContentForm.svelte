<script lang="ts">
	import TipTap from '$components/TipTap.svelte';
	import type { JsonValue } from '@prisma/client/runtime/library';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import type { CMSSchema } from '$lib/schemas';

	export let { content, id, contentForm } = $$props as {
		id: string;
		content: JsonValue;
		contentForm: SuperValidated<CMSSchema>;
	};

	$: JsonContent = content as unknown as Record<string, any>;
	// $: console.log(JsonContent);

	const { form, enhance } = superForm(contentForm, {
		id,
		dataType: 'json',
		onSubmit() {
			form.set({
				id,
				data: JSON.stringify(JsonContent)
			});
		}
	});
</script>

<form class="DynamicContentForm" use:enhance {id} method="POST" action="/admin?/update">
	<header class="DynamicContentForm__header">
		<h5>Path: {id}</h5>
	</header>
	{#each Object.keys(JsonContent) as field}
		{#if typeof JsonContent[field] === 'string'}
			<label for="name" class="CrispLabel">
				<span style="color: inherit;" data-mandatory> {field} </span>
				<TipTap name={field} bind:content={JsonContent[field]} />
			</label>
		{:else if Array.isArray(JsonContent[field])}
			This is array {field}
		{/if}
	{/each}
	<footer class="DynamicContentForm__footer">
		<button class="CrispButton" data-type="success" style="--crp-button-height: 25px;" form={id}>
			Save
		</button>
	</footer>
</form>

<style lang="scss">
	.DynamicContentForm {
		gap: 32px;
		width: 100%;
		border: 1px solid #e6e8eb;
		border-radius: 6px;
		box-shadow:
			#00000000 0px 0px 0px 0px,
			#00000000 0px 0px 0px 0px,
			#0000000d 0px 1px 2px 0px;
		@include make-flex($dir: column, $just: flex-start, $align: flex-start);

		&__header,
		&__footer {
			@include box($height: auto);
		}

		&__header {
			border-bottom: 1px solid #e6e8eb;
			padding: 16px 24px;
			& > h5 {
				font-size: 18px;
				font-weight: 500;
			}
		}

		// &__content {
		// 	gap: 15px;
		// 	@include make-flex();

		// 	.CrispLabel {
		// 		& > div {
		// 			gap: 10px;
		// 			width: 60%;
		// 			@include make-flex();
		// 			@include respondAt(620px) {
		// 				width: 100%;
		// 			}
		// 		}
		// 		&[data-direction='row'] {
		// 			@include respondAt(620px) {
		// 				flex-direction: column;
		// 			}
		// 		}
		// 	}
		// }

		&__footer {
			padding: 13px 24px;
			border-top: 1px solid #e6e8eb;
			@include make-flex($dir: row, $just: flex-end);
		}

		& > *:not(&__header):not(&__footer) {
			@include box($height: auto);
			padding: 16px 24px;
			width: 100%;
		}
	}
</style>
