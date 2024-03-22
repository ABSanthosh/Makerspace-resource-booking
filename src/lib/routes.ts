export interface Route {
  name: string;
  route: string;
  icon: number;
  children: Route[];
}

export const ADMIN_ROUTES: Route[] = [
  {
    name: 'Dashboard',
    route: '/admin',
    icon: 59530,
    children: [] as Route[]
  },
  {
    name: 'Equipment',
    route: '/admin/equipment',
    icon: 59964,
    children: [] as Route[]
  }
];

export const USER_ROUTES: Route[] = [
  {
    name: 'Dashboard',
    route: '/dash',
    icon: 59530,
    children: [] as Route[]
  },
  {
    name: 'Orders',
    route: '/dash/orders',
    icon: 60180,
    children: [] as Route[]
  }
];

export const HOME_ROUTES: Route[] = [
  {
    name: 'Home',
    route: '/',
    icon: 0,
    children: []
  },
  // {
  // 	name: 'Guides',
  // 	route: '/guides',
  // 	icon: 0,
  // 	children: []
  // },
  {
    name: 'Learning Modules',
    route: '/learning-modules',
    icon: 0,
    children: []
  },
  {
    name: 'Events',
    route: '/events',
    icon: 0,
    children: []
  },
  {
    name: 'Contact',
    route: '/contact',
    icon: 0,
    children: []
  },
  {
    name: 'Archive',
    route: '/archive',
    icon: 0,
    children: []
  },
  {
    name: 'Equipments',
    route: '/equipment',
    icon: 0,
    children: []
  }
];
