export const IKER_FINANCE_MENU_ITEMS = [
  {
    label: 'DASHBOARD',
    items: [
      { label: 'Overview', icon: 'pi pi-fw pi-home', to: '/dashboard/overview' },
    ],
  },
  {
    label: 'TRANSACTIONS',
    items: [
      { label: 'All Transactions', icon: 'pi pi-fw pi-list', to: '/dashboard/transactions' },
    ],
  },
  {
    label: 'BUDGETS',
    items: [
      { label: 'Manage Budgets', icon: 'pi pi-fw pi-wallet', to: '/dashboard/budgets' },
    ],
  },
  // TODO: Implement Categories Management
  // {
  //   label: 'CATEGORIES',
  //   items: [
  //     { label: 'Manage Categories', icon: 'pi pi-fw pi-tags', to: '/dashboard/categories' },
  //   ],
  // },
];