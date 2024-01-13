<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main class="Equipment">
	<div class="Equipment__content">
		{#each data.allEquipment as item}
			<div class="Equipment__card">
				<img src={item.image} alt={item.name} />
				<h2 class="w-100">{item.name}</h2>
				<p class="w-100">{item.model}</p>
			</div>
		{/each}
	</div>
</main>

<style lang="scss">
	.Equipment {
		@include make-flex();
		@include box();

		&__content {
			@include box();
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
			grid-template-rows: repeat(auto-fill, minmax(180px, 1fr));
			gap: 10px;
			padding: 20px;
		}

		&__card {
			@include make-flex();
			@include box();
			gap: 10px;

			border-radius: 10px;
			padding: 20px;
			background: #fff;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

			& > img {
				@include box(100px, 100px);
				object-fit: contain;
			}
		}
	}
</style>
