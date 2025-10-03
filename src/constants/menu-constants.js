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
  {
    label: 'CATEGORIES',
    items: [
      { label: 'Manage Categories', icon: 'pi pi-fw pi-tags', to: '/dashboard/categories' },
    ],
  },
  {
    label: 'REPORTS',
    items: [
      { label: 'Financial Summary', icon: 'pi pi-fw pi-chart-bar', to: '/dashboard/reports/financial' },
      { label: 'Budget Performance', icon: 'pi pi-fw pi-bullseye', to: '/dashboard/reports/budget-performance' },
    ],
  },
];