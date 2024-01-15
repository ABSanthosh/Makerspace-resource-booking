<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { BreadCrumbStore } from '$store/BreadCrumbStore';

	export let data: PageData;

	onMount(() => {
		BreadCrumbStore.update(() => {
			return [
				{
					name: 'Home',
					path: '/'
				},
				{
					name: 'Equipment',
					path: '/equipment'
				},
				{
					name: data.equipment.name,
					path: `/equipment/${data.equipment.id}`
				}
			];
		});
	});

	console.log(data.equipment);
</script>
