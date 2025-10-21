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
    label: 'SUPPORT',
    items: [
      { label: 'Help & FAQ', icon: 'pi pi-fw pi-question-circle', to: '/dashboard/support/faq' },
      { label: 'Submit Feedback', icon: 'pi pi-fw pi-comment', to: '/dashboard/support/feedback' },
    ],
  },
];
