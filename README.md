# IKER Finance - Frontend

A modern personal finance management application built with Next.js 14, Redux Toolkit, and PrimeReact.

## Prerequisites

### All Platforms
- Node.js 18 LTS
- Yarn package manager
- Git
- Code editor (Visual Studio Code recommended)

### Backend Dependency
- IKER Finance Backend API running on port 5000

## Setup Instructions

### 1. Clone and Setup Project

```bash
# Clone the repository
git clone https://github.com/IKER-Finance/iker-finance-frontend.git
cd iker-finance-frontend

# Verify Node.js installation
node --version
npm --version

# Install Yarn globally (if not already installed)
npm install -g yarn

# Install dependencies
yarn install
```

### 2. Environment Configuration

Copy the environment template:

```bash
cp .env.local.example .env.local
```

Update `.env.local` with your configuration:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1

# Application Configuration
NEXT_PUBLIC_APP_NAME="IKER Finance"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

### 3. Start Development Server

```bash
# Start the development server
yarn dev
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Automatic redirect to login if not authenticated
- Dashboard available after successful authentication

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Authentication route group
│   │   ├── login/                # Login page
│   │   └── register/             # Registration page
│   └── dashboard/                # Protected dashboard routes
│       ├── overview/             # Financial overview
│       ├── transactions/         # Transaction management
│       ├── categories/           # Category management
│       ├── budgets/              # Budget planning
│       └── reports/              # Financial reports
├── components/                   # Reusable UI components
│   └── auth/                     # Authentication components
├── redux/                        # State management
│   ├── store.js                  # Redux store configuration
│   └── feature/                  # Redux slices
├── layout/                       # Application layout components
│   └── context/                  # React contexts
├── services/                     # External service integrations
│   ├── api-service/              # HTTP client with interceptors
│   └── token-service/            # JWT token management
├── constants/                    # Application constants
└── styles/                       # Global styles and themes
    └── layout/                   # Layout-specific SCSS
```

## Development Commands

```bash
# Start development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Run linting
yarn lint

# Fix linting issues
yarn lint:fix

# Install new dependencies
yarn add <package-name>

# Install development dependencies
yarn add -D <package-name>
```

## Technology Stack

### Core Framework
- **Next.js 14** with App Router
- **React 18** with modern features
- **JavaScript (ES6+)** for development

### State Management
- **Redux Toolkit** for application state
- **React Redux** for React integration

### UI Framework
- **PrimeReact** enterprise-grade components
- **PrimeFlex** utility-first CSS framework
- **PrimeIcons** comprehensive icon library

### Styling
- **SCSS** enhanced CSS with variables
- **Responsive Design** mobile-first approach
- **Custom Layout System** enterprise patterns

### API Integration
- **Axios** HTTP client with interceptors
- **ASP.NET Identity** authentication integration
- **Role-based** route protection (Admin/User)

## Architecture

- **Next.js App Router** for modern React patterns
- **Redux Toolkit** for predictable state management
- **Role-based authentication** with ASP.NET Identity
- **Responsive design** for desktop and mobile
- **Component-based architecture** for reusability
- **SCSS styling system** with proper organization

## Authentication Flow

1. User registration/login through ASP.NET Identity endpoints
2. JWT token receipt and secure storage
3. Automatic token injection in API requests
4. Role-based route protection (Admin vs User)
5. Automatic token refresh and session management