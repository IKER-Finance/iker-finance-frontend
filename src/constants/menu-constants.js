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
  // TODO: Uncomment when API endpoints and functionality are ready
  // {
  //   label: 'CATEGORIES',
  //   items: [
  //     { label: 'Manage Categories', icon: 'pi pi-fw pi-tags', to: '/dashboard/categories' },
  //   ],
  // },
  // TODO: Uncomment when API endpoints and functionality are ready
  // {
  //   label: 'REPORTS',
  //   items: [
  //     { label: 'Financial Reports', icon: 'pi pi-fw pi-chart-bar', to: '/dashboard/reports' },
  //     { label: 'Export Data', icon: 'pi pi-fw pi-download', to: '/dashboard/export' },
  //   ],
  // },
  {
    label: 'SUPPORT',
    items: [
      // TODO: Replace under-construction pages with actual implementations
      { label: 'Help & FAQ', icon: 'pi pi-fw pi-question-circle', to: '/dashboard/support/faq' },
      { label: 'Submit Feedback', icon: 'pi pi-fw pi-comment', to: '/dashboard/support/feedback' },
    ],
  },
];