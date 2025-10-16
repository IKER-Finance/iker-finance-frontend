const PAGE_ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  
  dashboard: '/dashboard',
  overview: '/dashboard/overview',
  
  transactions: '/dashboard/transactions',
  addTransaction: '/dashboard/transactions/add',
  editTransaction: (id) => `/dashboard/transactions/edit/${id}`,
  
  budgets: '/dashboard/budgets',
  addBudget: '/dashboard/budgets/add',
  editBudget: (id) => `/dashboard/budgets/edit/${id}`,
  budgetDetails: (id) => `/dashboard/budgets/${id}`,
  
  categories: '/dashboard/categories',
  addCategory: '/dashboard/categories/add',
  editCategory: (id) => `/dashboard/categories/edit/${id}`,
  
  reports: '/dashboard/reports',
  profile: '/dashboard/profile',
  settings: '/dashboard/settings',

  faq: '/dashboard/support/faq',
  feedback: '/dashboard/support/feedback',
};

export default PAGE_ROUTES;