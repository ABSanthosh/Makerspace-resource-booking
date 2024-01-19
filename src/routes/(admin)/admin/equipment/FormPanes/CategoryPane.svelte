<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import type { ECategoriesZSchema } from '$lib/schemas';

	export let { modal, formStore } = $$props as {
		modal: boolean;
		formStore: SuperValidated<typeof ECategoriesZSchema>;
	};

	const { form, errors, enhance } = superForm(formStore, {
    id: 'CategoryForm',
    
  });
</script>

<style lang="scss">
</style>
