# IKER Finance - Frontend

Multi-currency personal finance management web application built with Next.js 14, Redux Toolkit, and PrimeReact.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://reactjs.org/)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC)](https://redux-toolkit.js.org/)
[![PrimeReact](https://img.shields.io/badge/PrimeReact-10.9-007AD9)](https://primereact.org/)

## Live Demo

**Live Application**: [https://iker-finance-site.onrender.com](https://iker-finance-site.onrender.com)

```
Test Credentials
Email: test@ikerfinance.com
Password: Test@123456
```

> Deployed on Render free tier - initial load may take 30-60 seconds (cold start).

## Overview

Modern web application for managing multi-currency personal finances with real-time budget tracking, transaction management, and comprehensive financial reporting.

**Key Features**

- **Multi-Currency Transactions** - Record expenses in any currency with automatic home currency conversion
- **Budget Management** - Create and track period-based budgets with category-level allocation
- **Real-Time Dashboard** - Visual spending summaries with charts and statistics
- **Transaction Filtering** - Advanced search and filter capabilities
- **Data Export** - Export transaction history in multiple formats
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

## Architecture

**Frontend Stack**

- **Next.js 14** with App Router for modern React architecture
- **Redux Toolkit** for centralized state management
- **PrimeReact** for enterprise-grade UI components
- **Axios** for API communication with interceptors
- **Joi** for client-side validation
- **CSS** for styling

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
├── app/                                   # Next.js App Router
│   ├── dashboard/                         # Protected dashboard routes
│   │   ├── {feature}/                     # Feature-specific pages
│   │   │   └── components/                # Feature components
│   │   ├── layout.js                      # Dashboard layout
│   │   └── page.js                        # Dashboard home
│   ├── login/                             # Authentication pages
│   ├── register/
│   └── page.js                            # Landing page
│
├── components/                            # Shared components
│   ├── auth/                              # Authentication components
│   ├── common/                            # Reusable UI components
│   └── layout/                            # Layout components
│
├── redux/                                 # State management
│   ├── feature/                           # Redux slices by feature
│   └── store.js                           # Store configuration
│
├── services/                              # API communication
│   ├── api-service/                       # Feature-specific API services
│   ├── token-service/                     # JWT token management
│   ├── api-client.js                      # Axios instance
│   └── index.js                           # Service exports
│
└── constants/                             # Application constants
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

Redux Toolkit slices handle feature-specific state:

```javascript
// Example: Using auth slice
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/redux/feature/auth-slice';

const user = useSelector((state) => state.auth.user);
const dispatch = useDispatch();
```

### API Services

Centralized service layer for API communication:

```javascript
// Example: Using transaction service
import { transactionService } from '@/services';

const transactions = await transactionService.getAllTransactions();
const newTransaction = await transactionService.createTransaction(data);
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
- Tailwind CSS 3.4 - Utility-first CSS

**Data & Validation**
- Axios 1.12 - HTTP client
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

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(transactions): add CSV export functionality
fix(budgets): correct period overlap validation
style(dashboard): improve mobile responsiveness
```

### Development Guidelines

1. Use Redux Toolkit for state management
2. Follow Next.js App Router conventions
3. Use PrimeReact components for UI consistency
4. Implement client-side validation with Joi
5. Keep components small and focused
6. Follow existing project structure patterns

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
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com/api
```

## Related Repositories

**Backend**: [iker-finance-backend](https://github.com/IKER-Finance/iker-finance-backend)

---

**Built with Next.js 14 | Powered by Redux Toolkit | Styled with PrimeReact**