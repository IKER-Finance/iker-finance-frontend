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
      { label: 'Add Transaction', icon: 'pi pi-fw pi-plus', to: '/dashboard/transactions/add' },
    ],
  },
  {
    label: 'BUDGETS',
    items: [
      { label: 'All Budgets', icon: 'pi pi-fw pi-chart-pie', to: '/dashboard/budgets' },
      { label: 'Add Budget', icon: 'pi pi-fw pi-plus', to: '/dashboard/budgets/add' },
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