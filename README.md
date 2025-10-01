# IKER Finance - Frontend

A personal finance management web application that helps you track expenses, manage budgets, and monitor your spending across multiple currencies. Perfect for students, travelers, and anyone managing finances in different countries.

## Live Demo & Access

### Hosted Environment
- **Live Application**: https://iker-finance-site.onrender.com
- **Backend API Documentation**: https://iker-finance.onrender.com/swagger

**Note**: Deployed on Render's free tier for demonstration and testing purposes.

### Default Test Account
```
Email: admin@ikerfinance.com
Password: Admin@123456
```

## What This Application Does

- **Track Expenses**: Record your daily spending and automatically convert between currencies
- **Manage Budgets**: Set monthly spending limits and get alerts when you're close to exceeding them
- **View Reports**: See visual charts and summaries of your spending patterns
- **Multi-Currency Support**: Handle expenses in different currencies with automatic conversion
- **Secure Login**: Your financial data is protected with secure user authentication

## Before You Start

### What You Need Installed

You'll need to install these programs on your computer:

1. **Node.js** - This is the software that runs JavaScript applications
   - Download from: https://nodejs.org/
   - Choose the "LTS" version (recommended for most users)
   - This will also install `npm` (Node Package Manager)

2. **Git** - This helps manage code versions
   - Download from: https://git-scm.com/
   - Follow the installation wizard with default settings

3. **A Code Editor** (optional but recommended)
   - Visual Studio Code: https://code.visualstudio.com/
   - This makes it easier to view and edit the code

### IMPORTANT: Backend Required

**This frontend application CANNOT work by itself.** You must also have the IKER Finance Backend running on your computer. 

- The backend should be running on `http://localhost:5008` (or port 5000)
- If you don't have the backend set up, please set that up first
- Both the frontend and backend need to be running at the same time

## Step-by-Step Setup Guide

### Step 1: Download the Code

Open your terminal or command prompt and run these commands:

```bash
# Download the project code
git clone https://github.com/IKER-Finance/iker-finance-frontend.git

# Go into the project folder
cd iker-finance-frontend
```

**Don't have Git?** You can also download the code as a ZIP file from GitHub and extract it.

### Step 2: Install Project Dependencies

The project needs additional software packages to work. Install them with:

```bash
# This will download and install all required packages (may take a few minutes)
npm install
```

**What's happening?** This downloads all the libraries and tools the application needs to run.

### Step 3: Configure the Application

Create a configuration file:

```bash
# Copy the example configuration file
cp .env.local.example .env.local
```

**On Windows?** If the above doesn't work, manually:
1. Copy the file `.env.local.example`
2. Paste it in the same folder
3. Rename the copy to `.env.local`

Open the `.env.local` file in a text editor and update it:

```env
# Tell the frontend where to find the backend
NEXT_PUBLIC_API_BASE_URL=http://localhost:5008/api

# Basic app information
NEXT_PUBLIC_APP_NAME="IKER Finance"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

**Important:** Make sure the port number (5008) matches where your backend is running.

### Step 4: Start the Application

```bash
# Start the development server
npm run dev
```

You should see a message like:
```
Ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Step 5: Access the Application

1. Open your web browser
2. Go to: `http://localhost:3000`
3. You should see the login page

## Working with Git (For Developers)

If you're making changes to the code, follow this git workflow:

### Creating a New Feature

Always create a new branch for each feature or bug fix:

```bash
# Make sure you're on the main branch and it's up to date
git checkout main
git pull origin main

# Create a new feature branch
git checkout -b feature/your-feature-name

# Examples of good branch names:
# feature/improve-login-styling
# feature/add-transaction-form
# bugfix/fix-registration-error
```

### Making Changes and Committing

```bash
# Check what files you've changed
git status

# Add your changes
git add .

# Commit with a descriptive message
git commit -m "feat: improve login page styling

- Add modern card design with shadows
- Improve form input styling with focus effects
- Make buttons more prominent with better colors
- Add responsive design for mobile devices"

# Push your branch to GitHub
git push -u origin feature/your-feature-name
```

### Commit Message Format

Use this format for commit messages:

```bash
# For new features
git commit -m "feat: description of what you added"

# For bug fixes  
git commit -m "fix: description of what you fixed"

# For styling changes
git commit -m "style: description of styling changes"

# For documentation updates
git commit -m "docs: description of documentation changes"
```

### Creating a Pull Request

1. Go to GitHub in your web browser
2. Navigate to your repository
3. Click "Compare & pull request" for your branch
4. Add a description of what you changed
5. Click "Create pull request"
6. Wait for code review before merging

### Updating Your Branch

If the main branch has new changes while you're working:

```bash
# Switch to main branch
git checkout main

# Get latest changes
git pull origin main

# Switch back to your feature branch
git checkout feature/your-feature-name

# Merge the updates into your branch
git merge main
```

### Common Git Commands

```bash
# See what branch you're on
git branch

# Switch to a different branch
git checkout branch-name

# See what files have changed
git status

# See your commit history
git log --oneline

# Undo changes to a file (before committing)
git checkout -- filename
```

## First Time Using the App

### Test Login Credentials

The backend comes with a test admin account:
- **Email:** `admin@ikerfinance.com`
- **Password:** `Admin@123456`

### Creating a New Account

1. Click "Register here" on the login page
2. Fill in your information:
   - First Name and Last Name
   - Email address (use a real one you remember)
   - Password (minimum 8 characters)
   - Confirm your password
3. Click "Register"
4. You'll be automatically logged in and taken to the dashboard

## Common Commands

Once everything is set up, you'll use these commands:

```bash
# Start the application (use this every time)
npm run dev

# Stop the application
# Press Ctrl+C in the terminal

# Install new features (if updates are made)
npm install

# Build for production (advanced users)
npm run build
```

## Troubleshooting

### Problem: "Command not found" errors
**Solution:** Make sure Node.js is properly installed. Restart your terminal and try again.

### Problem: Application won't start
**Solution:** 
1. Check that you're in the correct folder (`iker-finance-frontend`)
2. Make sure you ran `npm install` first
3. Check that no other application is using port 3000

### Problem: "Cannot connect to backend" or API errors
**Solution:**
1. **Most Common:** Make sure the backend is running first
2. Check that the backend is accessible at `http://localhost:5008`
3. Verify the `.env.local` file has the correct backend URL
4. Make sure both frontend and backend are running simultaneously

### Problem: Login doesn't work
**Solution:**
1. Verify the backend is running and accessible
2. Try the test admin account: `admin@ikerfinance.com` / `Admin@123456`
3. Check the browser's developer tools for error messages (F12 key)

### Problem: Page shows "Module not found" errors
**Solution:**
1. Delete the `node_modules` folder
2. Run `npm install` again
3. Restart the development server with `npm run dev`

## How to Stop the Application

- In the terminal where the app is running, press `Ctrl+C` (Windows/Linux) or `Cmd+C` (Mac)
- Close the terminal window
- Close your web browser tabs

## Project Structure (For Reference)

You don't need to understand this to use the app, but here's what the main folders contain:

```
src/
├── app/                     # Different pages of the website
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   └── dashboard/          # Main application pages
├── components/             # Reusable pieces of the interface
├── services/               # Code that talks to the backend
├── styles/                 # How the application looks (colors, fonts, etc.)
└── constants/              # Settings that don't change
```

## Getting Help

If you're stuck:

1. **Check this README again** - especially the troubleshooting section
2. **Make sure the backend is running** - this is the most common issue
3. **Check the terminal** for error messages
4. **Ask for help** - provide specific error messages you're seeing

## What Technologies This Uses

You don't need to learn these to use the app, but here's what powers it:

- **Next.js** - A framework for building web applications
- **React** - A library for creating user interfaces
- **Redux** - Manages the application's data and state
- **PrimeReact** - Pre-built user interface components
- **SCSS** - Enhanced styling language

## Development vs Production

**Development Mode** (what you're running):
- Shows detailed error messages
- Automatically refreshes when you make changes
- Includes debugging tools
- Runs on `http://localhost:3000`

**Production Mode** (for live websites):
- Optimized for speed and security
- No debugging information
- Requires additional setup and deployment