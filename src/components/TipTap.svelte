<script lang="ts">
	import StarterKit from '@tiptap/starter-kit';
	import Placeholder from '@tiptap/extension-placeholder';
	import { Editor, isActive } from '@tiptap/core';
	import { onDestroy, onMount } from 'svelte';
	import clickOutside from '$directive/clickOutside';
	import Icons from '../utils/Icons';
	import Underline from '@tiptap/extension-underline';

	export let { name, content } = $$props as {
		name: string;
		content: string;
	};

	let editor: Editor;
	let element: HTMLDivElement | undefined = undefined;

	$: isHeaderOpen = false;
	$: isFormatOpen = false;

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit,
				Underline,
				Placeholder.configure({
					placeholder: 'Write something …'
				})
			],
			content,
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			},
			onUpdate: ({ editor }) => {
				content = editor.getHTML();
			}
		});
	});
	onDestroy(() => {
		if (editor) editor.destroy();
	});
</script>

<div class="Editor">
	{#if editor}
		<ul class="Editor__toolbar">
			<button
				on:click={() => editor.chain().focus().toggleBold().run()}
				disabled={!editor.can().chain().focus().toggleBold().run()}
				class:isActive={editor.isActive('bold')}
				class="CrispButton"
				title="Bold"
			>
				{@html Icons.bold}
			</button>
			<button
				on:click={() => editor.chain().focus().toggleItalic().run()}
				disabled={!editor.can().chain().focus().toggleItalic().run()}
				class:isActive={editor.isActive('italic')}
				class="CrispButton"
				title="Italic"
			>
				{@html Icons.italic}
			</button>
			<button
				on:click={() => editor.chain().focus().toggleStrike().run()}
				disabled={!editor.can().chain().focus().toggleStrike().run()}
				class:isActive={editor.isActive('strike')}
				class="CrispButton"
				title="Strikethrough"
			>
				{@html Icons.strikethrough}
			</button>
			<button
				on:click={() => editor.chain().focus().toggleCode().run()}
				disabled={!editor.can().chain().focus().toggleCode().run()}
				class:isActive={editor.isActive('code')}
				class="CrispButton"
				title="Inline Code"
			>
				{@html Icons.inlineCode}
			</button>
			<button
				on:click={() => editor.chain().focus().setParagraph().run()}
				class:isActive={editor.isActive('paragraph')}
				class="CrispButton"
				title="Paragraph"
			>
				{@html Icons.paragraph}
			</button>

			<button
				on:click={() => editor.chain().focus().toggleUnderline().run()}
				class:isActive={editor.isActive('underline')}
				class="CrispButton"
				title="Underline"
			>
				{@html Icons.underline}
			</button>

			<details
				use:clickOutside
				bind:open={isHeaderOpen}
				class="CrispMenu"
				on:outclick={() => (isHeaderOpen = false)}
			>
				<summary>
					<span> Headings </span>
					<span>
						{#if editor.isActive('heading', { level: 1 })}
							{@html Icons.h1}
						{:else if editor.isActive('heading', { level: 2 })}
							{@html Icons.h2}
						{:else if editor.isActive('heading', { level: 3 })}
							{@html Icons.h3}
						{:else if editor.isActive('heading', { level: 4 })}
							{@html Icons.h4}
						{:else if editor.isActive('heading', { level: 5 })}
							{@html Icons.h5}
						{:else if editor.isActive('heading', { level: 6 })}
							{@html Icons.h6}
						{/if}
					</span>
				</summary>
				<ul class="CrispMenu__content" data-align="right" data-direction="bottom">
					<button
						on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
						class:isActive={editor.isActive('heading', { level: 1 })}
						class="CrispButton w-100"
						data-type="ghost"
						title="Biggest(H1)"
					>
						{@html Icons.h1}
						<span> Biggest </span>
					</button>
					<button
						on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
						class:isActive={editor.isActive('heading', { level: 2 })}
						class="CrispButton w-100"
						data-type="ghost"
						title="Bigger(H2)"
					>
						{@html Icons.h2}
						<span> Bigger </span>
					</button>
					<button
						on:click={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
						class:isActive={editor.isActive('heading', { level: 3 })}
						class="CrispButton w-100"
						data-type="ghost"
						title="Medium(H3)"
					>
						{@html Icons.h3}
						<span> Medium </span>
					</button>
					<button
						on:click={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
						class:isActive={editor.isActive('heading', { level: 4 })}
						class="CrispButton w-100"
						data-type="ghost"
						title="Normal(H4)"
					>
						{@html Icons.h4}
						<span> Normal </span>
					</button>
					<button
						on:click={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
						class:isActive={editor.isActive('heading', { level: 5 })}
						class="CrispButton w-100"
						data-type="ghost"
						title="Small(H5)"
					>
						{@html Icons.h5}
						<span> Small </span>
					</button>
					<button
						on:click={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
						class:isActive={editor.isActive('heading', { level: 6 })}
						class="CrispButton w-100"
						data-type="ghost"
						title="Smallest(H6)"
					>
						{@html Icons.h6}
						<span> Smallest </span>
					</button>
				</ul>
			</details>

			<details
				use:clickOutside
				bind:open={isFormatOpen}
				class="CrispMenu"
				on:outclick={() => (isFormatOpen = false)}
			>
				<summary>
					<span> Format </span>
					<span>
						{#if editor.isActive('bulletList')}
							{@html Icons.bulletList}
						{:else if editor.isActive('orderedList')}
							{@html Icons.orderedList}
						{:else if editor.isActive('codeBlock')}
							{@html Icons.codeBlock}
						{:else if editor.isActive('blockquote')}
							{@html Icons.blockquote}
						{:else if editor.isActive('horizontalRule')}
							{@html Icons.hr}
						{:else if editor.isActive('hardBreak')}
							{@html Icons.hardBreak}
						{/if}
					</span>
				</summary>
				<ul class="CrispMenu__content" data-align="right" data-direction="bottom">
					<button
						on:click={() => editor.chain().focus().toggleBulletList().run()}
						class:isActive={editor.isActive('bulletList')}
						class="CrispButton w-100"
						data-type="ghost"
						title="Bullet List"
					>
						{@html Icons.bulletList}
						<span> Bullet List </span>
					</button>
					<button
						on:click={() => editor.chain().focus().toggleOrderedList().run()}
						class:isActive={editor.isActive('orderedList')}
						class="CrispButton w-100"
						data-type="ghost"
						title="Ordered List"
					>
						{@html Icons.orderedList}
						<span> Ordered List </span>
					</button>
					<button
						on:click={() => editor.chain().focus().toggleCodeBlock().run()}
						class:isActive={editor.isActive('codeBlock')}
						class="CrispButton w-100"
						data-type="ghost"
						title="Code Block"
					>
						{@html Icons.codeBlock}
						<span> Code Block </span>
					</button>
					<button
						on:click={() => editor.chain().focus().toggleBlockquote().run()}
						class:isActive={editor.isActive('blockquote')}
						class="CrispButton w-100"
						data-type="ghost"
						title="Blockquote"
					>
						{@html Icons.blockquote}
						<span> Blockquote </span>
					</button>
					<button
						class="CrispButton w-100"
						data-type="ghost"
						on:click={() => editor.chain().focus().setHorizontalRule().run()}
						title="Horizontal Rule"
					>
						{@html Icons.hr}
						<span> Horizontal Rule </span>
					</button>
					<button
						class="CrispButton w-100"
						data-type="ghost"
						on:click={() => editor.chain().focus().setHardBreak().run()}
						title="Hard Break"
					>
						{@html Icons.hardBreak}
						<span> Hard Break </span>
					</button>
					<button
						class="CrispButton w-100"
						data-type="clear"
						on:click={() => editor.chain().focus().unsetAllMarks().run()}
					>
						{@html Icons.eraser}
						<span> Clear marks </span>
					</button>
					<button
						class="CrispButton w-100"
						data-type="clear"
						on:click={() => editor.chain().focus().clearNodes().run()}
					>
						{@html Icons.removeFormat}
						<span> Clear nodes </span>
					</button>
				</ul>
			</details>

			<div class="Row--center gap-10" style="margin-left: auto;">
				<button
					class="CrispButton"
					on:click={() => editor.chain().focus().undo().run()}
					disabled={!editor.can().chain().focus().undo().run()}
					title="Undo"
				>
					{@html Icons.undo}
				</button>
				<button
					class="CrispButton"
					on:click={() => editor.chain().focus().redo().run()}
					disabled={!editor.can().chain().focus().redo().run()}
					title="Redo"
				>
					{@html Icons.redo}
				</button>
			</div>
		</ul>
	{/if}
	<div class="Editor--box" id="tiptap-{name}" bind:this={element} />
</div>

<style lang="scss" global>
	.Editor {
		--crp-tiptap-border: 1px solid #dfe3e6;
		--crp-tiptap-border-hover: 1px solid #d7dbdf;
		--crp-tiptap-border-color-error: #ff4d4f;
		--crp-tiptap-box-shadow-focus: #00000000 0px 0px 0px 0px, #eceef0 0px 0px 0px 1px,
			#0000001a 0px 2px 2px -1px, #0000001a 0px 2px 4px -2px;
		--crp-tiptap-border-color-disabled: #d9d9d9;
		--crp-tiptap-border-radius: 8px;
		--crp-tiptap-color: #000000;
		--crp-tiptap-color-disabled: #929292;
		--crp-tiptap-color-placeholder: #bfbfbf;
		--crp-tiptap-color-placeholder-disabled: #d9d9d9;
		--crp-tiptap-font-size: 14px;
		--crp-tiptap-box-shadow: #ffffff09 0px 0px 0px 0px, #eceef009 0px 0px 0px 0.075px,
			#0000000d 0px 1.11119px 2.14825px -0.0370623px, #00000001 0px 0.075px 0.148249px -0.075px;
		--crp-tiptap-width: 100%;
		--crp-tiptap-background-color: #ffffff;
		--crp-tiptap-min-height: 200px;
		--crp-tiptap-padding: 12px;

		color: var(--crp-tiptap-color);
		border: var(--crp-tiptap-border);
		padding: var(--crp-tiptap-padding);
		transition: border-color 0.3s ease;
		font-size: var(--crp-tiptap-font-size);
		box-shadow: var(--crp-tiptap-box-shadow);
		border-radius: var(--crp-tiptap-border-radius);
		background-color: var(--crp-tiptap-background-color);
		@include box(var(--crp-tiptap-width), auto);
		min-height: var(--crp-tiptap-min-height);

		@include make-flex();
		gap: 20px;

		&__toolbar {
			list-style: none;
			width: 100%;
			@include make-flex($dir: row, $just: flex-start);
			flex-wrap: wrap;
			gap: 10px;

			.CrispMenu {
				& > summary {
					@include make-flex($dir: row, $just: space-between, $align: center);
					padding-left: 10px;
					padding-right: 25px;

					& > span {
						@include make-flex($dir: row);
					}
					& svg {
						@include box(auto, 18px);
					}
				}
			}

			.CrispButton {
				&:not([data-type='ghost']) {
					--crp-button-padding-left: 7px;
					--crp-button-padding-right: 7px;
					--crp-button-padding-top: 7px;
					--crp-button-padding-bottom: 7px;
					& > svg {
						@include box();
					}
				}

				&[data-type='ghost'] {
					--crp-button-padding-top: 5px;
					--crp-button-padding-bottom: 5px;
					justify-content: flex-start;
					& > svg {
						@include box(auto);
					}
				}

				&[data-type='clear'] {
					--crp-button-color: #ffffff;
					--crp-button-color-hover: #ff605c;
					--crp-button-background-color: #ff605c;
					--crp-button-background-color-hover: white;
					--crp-button-border: 1px solid #ff605c;
					--crp-button-border-hover: 1px solid #ff605c;
					--crp-button-box-shadow: transparent;

					justify-content: flex-start;

					& > svg {
						@include box(auto);
					}
				}

				&.isActive {
					--crp-button-background-color: #d7d7d7 !important;
					--crp-button-background-color-hover: #efefef !important;
					--crp-button-border: 1px solid #dfe3e6 !important;
					--crp-button-border-hover: 1px solid #d7dbdf !important;
				}

				&:disabled {
					& > svg {
						stroke: var(--crp-tiptap-color-disabled);
					}
				}
			}
		}

		&--box {
			@include box();
		}

		.tiptap {
			min-height: var(--crp-tiptap-min-height);
			min-width: 100%;
			outline: none;

			.is-editor-empty:first-child::before {
				color: #adb5bd;
				content: attr(data-placeholder);
				float: left;
				font-size: 17px;
				height: 0;
				pointer-events: none;
			}

			> * + * {
				margin-top: 0.75em;
				font-size: 17px;
			}

			ul,
			ol {
				padding: 0 1rem;
			}

			h1,
			h2,
			h3,
			h4,
			h5,
			h6 {
				line-height: 1.1;
			}

			code {
				background-color: rgba(#616161, 0.1);
				color: #616161;
			}

			pre {
				background: #0d0d0d;
				color: #fff;
				font-family: 'JetBrainsMono', monospace;
				padding: 0.75rem 1rem;
				border-radius: 0.5rem;

				code {
					color: inherit;
					padding: 0;
					background: none;
					font-size: 0.8rem;
				}
			}

			img {
				max-width: 100%;
				height: auto;
			}

			blockquote {
				padding-left: 1rem;
				border-left: 2px solid rgba(#0d0d0d, 0.1);
			}

			hr {
				border: none;
				border-top: 2px solid rgba(#0d0d0d, 0.1);
				margin: 2rem 0;
			}
		}
	}
</style>
