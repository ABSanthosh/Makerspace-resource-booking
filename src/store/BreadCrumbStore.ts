import { writable } from 'svelte/store';

export let isEquipmentDeletedStore = writable<boolean | undefined>(undefined);

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
