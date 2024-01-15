import { writable } from 'svelte/store';

export let BreadCrumbStore = writable<
	{
		name: string;
		path: string;
	}[]
>([
	{
		name: 'Home',
		path: '/'
	}
]);
