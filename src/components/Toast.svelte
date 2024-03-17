<script lang="ts">
	import { elasticInOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	export let { message } = $$props as {
		message: string;
	};
</script>

<span class="Toast" transition:fly={{ y: 20, duration: 350, easing: elasticInOut }}>
	{message}
</span>

<style lang="scss">
	.Toast {
		right: 50%;
		bottom: 20px;
		z-index: 100;
		position: fixed;
		padding: 10px 20px;
		border-radius: 50px;
		white-space: nowrap;
		color: #1f2328;
		transform: translateX(50%);
		box-shadow: 0px 3px 35px 4px rgba(0, 0, 0, 0.25);
		border: 1px solid #d0d7de;
		background-color: #f6f8fa;
	}
</style>
