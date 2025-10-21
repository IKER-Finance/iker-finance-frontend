# IKER Finance - Frontend

Multi-currency personal finance management web application built with Next.js 14, Redux Toolkit, and PrimeReact.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://reactjs.org/)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC)](https://redux-toolkit.js.org/)
[![PrimeReact](https://img.shields.io/badge/PrimeReact-10.9-007AD9)](https://primereact.org/)

## Live Demo

**Live Application**: [https://iker-finance-site.onrender.com](https://iker-finance-site.onrender.com)

**Test Credentials**
```
Email: test@ikerfinance.com
Password: Test@123456
```

> **Note**: Deployed on Render free tier - initial load may take 30-60 seconds due to cold start.

## Overview

Modern web application for managing multi-currency personal finances with real-time budget tracking, transaction management, and comprehensive financial reporting.

**Key Features**

- **Multi-Currency Transactions** - Record expenses in any currency with automatic home currency conversion
- **Transaction Management** - View, edit, delete, and filter transaction history with advanced search
- **Budget Management** - Create, edit, and delete period-based budgets (weekly, monthly, yearly) with category allocation
- **Budget Tracking & Alerts** - Real-time budget monitoring with alerts at 80% and 100% spending thresholds
- **Dashboard Overview** - Visual spending summaries, budget status, and recent transactions in home currency
- **Support System** - FAQ/guidelines and feedback/bug report submission
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

## Architecture

**Frontend Stack**

- **Next.js 14** with App Router for modern React architecture
- **Redux Toolkit** for centralized state management
- **PrimeReact** for enterprise-grade UI components
- **Axios** for API communication with interceptors
- **Joi** for client-side validation
- **Tailwind CSS & Sass** for styling with utility-first approach
- **Framer Motion** for smooth animations and transitions

**Design Patterns**

- **Feature-Based Structure** - Organized by business domain
- **Redux Slices** - Modular state management per feature
- **Service Layer** - Centralized API communication
- **Component Composition** - Reusable UI components
- **Token-Based Auth** - JWT authentication with automatic refresh

## Prerequisites

- [Node.js 18+](https://nodejs.org/)
- IKER Finance Backend running on `http://localhost:5008`

## Quick Start

1. **Clone and install dependencies**

```bash
git clone https://github.com/IKER-Finance/iker-finance-frontend.git
cd iker-finance-frontend
npm install
```

2. **Configure environment**

Create `.env.local`:

```env
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5008/api
```

3. **Start development server**

```bash
npm run dev
```

Application available at: `http://localhost:3000`

## Project Structure

```
src/
├── app/                    # Next.js App Router - pages and routing
│   ├── dashboard/          # Protected dashboard pages
│   │   ├── overview/       # Dashboard home with financial summary
│   │   ├── budgets/        # Budget creation and management
│   │   ├── transactions/   # Transaction history and management
│   │   ├── categories/     # Expense category management
│   │   ├── reports/        # Financial reports and analytics
│   │   ├── export/         # Data export functionality
│   │   ├── profile/        # User profile management
│   │   ├── settings/       # Application settings
│   │   └── support/        # FAQ and feedback system
│   ├── login/              # User authentication
│   └── register/           # User registration
├── components/             # Shared React components
├── layout/                 # Layout components (topbar, sidebar, menu)
├── redux/                  # Redux Toolkit slices and store configuration
├── services/               # API communication layer with Axios
├── utils/                  # Utility functions (formatting, token management)
├── hooks/                  # Custom React hooks
├── lib/                    # Library utilities and validators
├── constants/              # Application constants and configuration
└── styles/                 # Global CSS styles
```

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### State Management

Redux Toolkit slices manage application state across features:

**Available Slices**
- `auth-slice` - Authentication and user session
- `budget-slice` - Budget data and operations
- `transaction-slice` - Transaction management
- `feedback-slice` - User feedback and support
- `profile-slice` - User profile information

```javascript
// Example: Using Redux in components
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/redux/feature/auth-slice';

function LoginComponent() {
  const { user, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogin = async (credentials) => {
    await dispatch(loginUser(credentials));
  };

  return (
    // Component JSX
  );
}
```

### API Services

Centralized service layer for all API communication with the backend:

```javascript
// Example: Using services in components
import { transactionService, budgetService } from '@/services';

// Fetch all transactions
const fetchTransactions = async () => {
  try {
    const response = await transactionService.getAllTransactions();
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
  }
};

// Create a new transaction
const createTransaction = async (transactionData) => {
  try {
    const response = await transactionService.createTransaction(transactionData);
    return response.data;
  } catch (error) {
    console.error('Error creating transaction:', error);
  }
};
```

### Authentication Flow

1. User logs in via `/login`
2. JWT token stored in localStorage via `tokenService`
3. Axios interceptor adds token to all requests
4. Protected routes check authentication status
5. Automatic redirect on token expiration

## Technology Stack

**Core Framework**
- Next.js 14.2 - React framework with App Router
- React 18 - UI library

**State Management**
- Redux Toolkit 2.9 - State management
- React-Redux 9.2 - React bindings for Redux

**UI & Styling**
- PrimeReact 10.9 - Enterprise UI component library
- PrimeFlex 4.0 - Utility CSS framework
- PrimeIcons 7.0 - Icon library
- Tailwind CSS 3.4 - Utility-first CSS framework
- Sass 1.93 - CSS preprocessor
- Framer Motion 12.23 - Animation library

**Data & Validation**
- Axios 1.12 - HTTP client with interceptors
- Joi 18.0 - Schema validation

**Development Tools**
- ESLint 8 - Code linting
- PostCSS 8 - CSS transformations

## Contributing

### Git Workflow

1. Create feature branch from `develop`

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

2. Make changes and commit

```bash
git add .
git commit -m "feat: add transaction filtering by date range"
git push origin feature/your-feature-name
```

3. Create Pull Request to `develop`

### Branch Naming

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `style/description` - UI/styling updates
- `docs/description` - Documentation updates

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `style:` - UI/styling changes
- `docs:` - Documentation updates
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Examples**
```
feat(transactions): add CSV export functionality
fix(budgets): correct period overlap validation
style(dashboard): improve mobile responsiveness
refactor(auth): simplify token refresh logic
```

### Development Guidelines

1. **State Management** - Use Redux Toolkit for all global state
2. **Routing** - Follow Next.js App Router conventions and file-based routing
3. **UI Components** - Use PrimeReact components for UI consistency
4. **Validation** - Implement client-side validation with Joi schemas
5. **Code Quality** - Keep components small, focused, and reusable
6. **Styling** - Use Tailwind utilities for layout, PrimeReact themes for components
7. **API Calls** - Always use the service layer, never call Axios directly in components
8. **Error Handling** - Implement proper try-catch blocks and user feedback

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | Yes |

## Deployment

### Build

```bash
npm run build
npm start
```

### Environment Setup

Update `.env.production` with production values:

```env
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com/api
```

## Related Repositories

**Backend**: [iker-finance-backend](https://github.com/IKER-Finance/iker-finance-backend)

---

**Built with Next.js 14 | Powered by Redux Toolkit | Styled with PrimeReact**