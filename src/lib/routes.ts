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
  },
  {
    name: "Demo",
    route: "/admin/demo",
    icon: 59530,
    children: [
      {
        name: "Demo 1",
        route: "/admin/demo/demo1",
        icon: 59530,
        children: [] as Route[],
      },
      {
        name: "Demo 2",
        route: "/admin/demo/demo2",
        icon: 59530,
        children: [] as Route[],
      },
    ]
  },
];

