'use client';
import { useState } from 'react';
import { Card } from 'primereact/card';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import PAGE_ROUTES from '@/constants/page-constants';

const FAQContent = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  // FAQ data structure
  const faqData = [
    {
      category: 'Getting Started',
      icon: 'pi-play-circle',
      questions: [
        {
          question: 'What is IKER Finance?',
          answer: 'IKER Finance is a comprehensive personal finance management application that helps you track your expenses, manage budgets, and gain insights into your spending habits. It supports multiple currencies and provides real-time budget alerts to help you stay on track with your financial goals.',
        },
        {
          question: 'How do I create an account?',
          answer: 'Click on the "Register" link on the login page. Fill in your first name, last name, email address, and create a secure password. After submitting the registration form, you can immediately log in and start using the application.',
        },
        {
          question: 'How do I log in?',
          answer: 'Enter your email address and password on the login page. Your session will remain active for security purposes. If you forget your password, use the password reset feature on the login page.',
        },
        {
          question: 'How secure is my data?',
          answer: 'We take security seriously. All data is encrypted in transit and at rest. Your password is securely hashed, and we use JWT (JSON Web Tokens) for authentication. We never store your password in plain text, and all API communications are secured.',
        },
      ],
    },
    {
      category: 'Transactions',
      icon: 'pi-list',
      questions: [
        {
          question: 'How do I add a transaction?',
          answer: 'Navigate to "All Transactions" from the sidebar menu and click the "Add New Transaction" button. Fill in the required fields: description, amount, category, currency, date, and optional notes. Click "Add" to save your transaction. The transaction will immediately appear in your transaction list and affect your budget calculations.',
        },
        {
          question: 'Can I edit or delete transactions?',
          answer: 'Yes! In the transactions list, each row has action buttons. Click the edit icon (pencil) to modify a transaction or the delete icon (trash) to remove it. When editing, all fields can be updated. Deleted transactions are permanently removed and cannot be recovered.',
        },
        {
          question: 'What currencies are supported?',
          answer: 'IKER Finance supports multiple currencies including SEK (Swedish Krona), USD (US Dollar), EUR (Euro), and many more. When creating a transaction or budget, you can select from any active currency in the system. The application handles multi-currency transactions seamlessly.',
        },
        {
          question: 'Can I add notes to transactions?',
          answer: 'Yes, the notes field is optional but recommended for adding context to your transactions. You can add details like receipt numbers, merchant information, or any other relevant information that helps you remember the transaction later.',
        },
        {
          question: 'How far back can I add transactions?',
          answer: 'You can add transactions for any date in the past up to today. Future-dated transactions are not allowed to maintain data accuracy. This is useful for entering historical data or catching up on transactions you forgot to record.',
        },
        {
          question: 'Can I see a summary of my transactions?',
          answer: 'Yes! The Dashboard Overview page shows a summary of your recent transactions, total spending, and spending trends. You can also filter transactions by date range, category, or search for specific transactions in the All Transactions page.',
        },
      ],
    },
    {
      category: 'Budgets',
      icon: 'pi-wallet',
      questions: [
        {
          question: 'What is a budget?',
          answer: 'A budget is a spending limit you set for a specific category over a defined period (weekly, monthly, quarterly, or yearly). Budgets help you control spending and receive alerts when you approach or exceed your limits. Each budget is tracked independently and can be activated or deactivated as needed.',
        },
        {
          question: 'How do I create a budget?',
          answer: 'Go to "Manage Budgets" in the sidebar and click "Add New Budget". Select a category, set your budget amount, choose a currency, select the budget period (weekly, monthly, quarterly, or yearly), set the start date, and add an optional description. You can also mark the budget as active or inactive. Click "Add" to create your budget.',
        },
        {
          question: 'What are budget periods?',
          answer: 'Budget periods define the time frame for your spending limit:\n\n• Weekly: Budget resets every week from your start date\n• Monthly: Budget resets every month (30-day period)\n• Quarterly: Budget resets every 3 months (90 days)\n• Yearly: Budget resets annually (365 days)\n\nChoose a period that matches your financial planning style. For example, use monthly budgets for rent and utilities, or weekly budgets for groceries.',
        },
        {
          question: 'How do budget alerts work?',
          answer: 'Budget alerts automatically notify you when your spending approaches or exceeds your budget limits. Alerts are color-coded:\n\n• Green: Under 60% of budget (on track)\n• Yellow: 60-80% of budget (approaching limit)\n• Orange: 80-100% of budget (near limit)\n• Red: Over 100% of budget (exceeded)\n\nYou can see all active alerts on your Dashboard Overview.',
        },
        {
          question: 'What happens when I exceed my budget?',
          answer: 'When you exceed a budget, you\'ll see a red alert indicator showing the overage amount and percentage. The system won\'t prevent you from adding transactions, but it will clearly highlight that you\'ve exceeded your limit. This helps you make informed decisions about your spending.',
        },
        {
          question: 'Can I have multiple budgets for different categories?',
          answer: 'Absolutely! You can create as many budgets as you need, each for different categories. For example, you might have a monthly budget for groceries, a weekly budget for entertainment, and a yearly budget for travel. Each budget is tracked independently.',
        },
        {
          question: 'Can I deactivate a budget?',
          answer: 'Yes, you can deactivate budgets you no longer want to track. Edit the budget and uncheck the "Is Active" checkbox. Inactive budgets won\'t show alerts or appear in your dashboard, but their historical data is preserved.',
        },
        {
          question: 'Will adding a transaction show budget impact?',
          answer: 'Yes! When creating a new transaction, the form shows a real-time budget impact preview if you have an active budget for that category. You\'ll see how the transaction will affect your budget before you submit it, helping you make informed spending decisions.',
        },
      ],
    },
    {
      category: 'Categories',
      icon: 'pi-tags',
      questions: [
        {
          question: 'What are transaction categories?',
          answer: 'Categories help organize your transactions and budgets. Common categories include Groceries, Transportation, Entertainment, Utilities, Housing, Healthcare, and more. Each transaction must be assigned to a category, which enables budget tracking and spending analysis.',
        },
        {
          question: 'Can I create custom categories?',
          answer: 'Custom category management is coming soon! Currently, you can use the predefined categories available in the system. Future updates will allow you to create, edit, and delete your own categories to match your specific needs.',
        },
      ],
    },
    {
      category: 'Dashboard & Overview',
      icon: 'pi-home',
      questions: [
        {
          question: 'What metrics are shown on the dashboard?',
          answer: 'The Dashboard Overview displays key financial metrics:\n\n• Total Spent: Your total spending for the current period\n• Budgets on Track: Number of budgets under 80% utilization\n• Total Budgets: Total number of active budgets\n• Spending Change: Comparison with previous period\n• Recent Transactions: Your latest 5 transactions\n• Active Budgets: List of all active budgets with progress bars\n• Budget Alerts: Color-coded warnings for budgets approaching limits',
        },
        {
          question: 'How is spending change calculated?',
          answer: 'Spending change compares your current period spending with the previous period. It shows both the absolute amount difference and the percentage change. A positive value means you spent more this period, while a negative value means you spent less.',
        },
        {
          question: 'What does "budgets on track" mean?',
          answer: '"Budgets on track" counts how many of your active budgets are under 80% utilization. This is a quick indicator of your overall financial health. If most budgets are on track, you\'re managing your spending well within your limits.',
        },
      ],
    },
    {
      category: 'Account & Settings',
      icon: 'pi-cog',
      questions: [
        {
          question: 'How do I update my profile?',
          answer: 'Click on your profile icon in the top navigation bar to access profile settings. You can update your personal information including first name, last name, and other account details. Changes are saved immediately.',
        },
        {
          question: 'How do I change my password?',
          answer: 'Navigate to Settings from the sidebar menu. In the security section, you can change your password by entering your current password and your new password. Make sure to use a strong password with a mix of letters, numbers, and special characters.',
        },
        {
          question: 'Can I export my financial data?',
          answer: 'Data export functionality is coming soon! Future updates will allow you to export your transactions, budgets, and reports in various formats (CSV, Excel, PDF) for backup or analysis purposes.',
        },
        {
          question: 'How do I delete my account?',
          answer: 'If you wish to delete your account, please contact support through the "Submit Feedback" page with the subject "Account Deletion Request". We\'ll process your request and permanently remove all your data within 30 days.',
        },
      ],
    },
    {
      category: 'Troubleshooting',
      icon: 'pi-exclamation-triangle',
      questions: [
        {
          question: 'I forgot my password. What should I do?',
          answer: 'On the login page, click the "Forgot Password" link. Enter your registered email address, and we\'ll send you instructions to reset your password. If you don\'t receive the email, check your spam folder or contact support.',
        },
        {
          question: 'My transaction is not showing up',
          answer: 'Try refreshing the page first. If the transaction still doesn\'t appear, check your filters (date range, search term) to ensure they\'re not hiding the transaction. If the issue persists, the transaction may not have been saved successfully - try adding it again.',
        },
        {
          question: 'Budget alerts are not working',
          answer: 'Make sure your budget is marked as "Active" and the category matches your transactions. Also verify that the budget period includes the current date. If the issue continues, try editing and re-saving the budget, or contact support through the feedback form.',
        },
        {
          question: 'The page is loading slowly',
          answer: 'Slow loading can be caused by network issues or heavy data. Try:\n\n• Refreshing the page\n• Clearing your browser cache\n• Checking your internet connection\n• Using a different browser\n\nIf the problem persists across multiple sessions, please report it through the "Submit Feedback" page.',
        },
        {
          question: 'I see an error message when submitting a form',
          answer: 'Error messages indicate validation issues or server problems. Common causes:\n\n• Required fields are empty\n• Input exceeds character limits\n• Invalid date or number format\n• Network connection issues\n\nRead the error message carefully - it usually explains what needs to be fixed. If you believe the error is incorrect, please report it via the feedback form.',
        },
      ],
    },
  ];

  // Filter FAQ based on search term
  const filteredFAQ = faqData.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0);

  return (
    <div className="flex flex-column gap-4">
      {/* Hero Section */}
      <Card className="shadow-2">
        <div className="flex flex-column align-items-center text-center gap-3">
          <i className="pi pi-question-circle text-6xl text-primary"></i>
          <h1 className="text-4xl font-bold m-0">Help & FAQ</h1>
          <p className="text-xl text-color-secondary m-0" style={{ maxWidth: '600px' }}>
            Find answers to common questions about using IKER Finance. Can&apos;t find what you&apos;re looking for?{' '}
            <span
              className="text-primary cursor-pointer"
              onClick={() => router.push(PAGE_ROUTES.feedback)}
              style={{ textDecoration: 'underline' }}
            >
              Submit feedback
            </span>{' '}
            and we&apos;ll help you out!
          </p>
        </div>
      </Card>

      {/* Search Box */}
      <Card className="shadow-2">
        <div className="flex flex-column gap-2">
          <label htmlFor="faq-search" className="font-semibold">
            Search FAQs
          </label>
          <span className="p-input-icon-left w-full">
            <i className="pi pi-search" />
            <InputText
              id="faq-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type keywords to search questions and answers..."
              className="w-full"
            />
          </span>
          {searchTerm && (
            <small className="text-color-secondary">
              Found {filteredFAQ.reduce((acc, cat) => acc + cat.questions.length, 0)} result(s)
            </small>
          )}
        </div>
      </Card>

      {/* Quick Action Cards */}
      {!searchTerm && (
        <div className="grid">
          <div className="col-12 md:col-6 lg:col-3">
            <Card className="shadow-2 h-full cursor-pointer hover:shadow-4 transition-duration-200">
              <div
                className="flex flex-column align-items-center text-center gap-3"
                onClick={() => router.push(PAGE_ROUTES.transactions)}
              >
                <i className="pi pi-plus-circle text-4xl text-blue-500"></i>
                <h3 className="m-0">Add Transaction</h3>
                <p className="text-color-secondary m-0">Record a new expense or income</p>
              </div>
            </Card>
          </div>
          <div className="col-12 md:col-6 lg:col-3">
            <Card className="shadow-2 h-full cursor-pointer hover:shadow-4 transition-duration-200">
              <div
                className="flex flex-column align-items-center text-center gap-3"
                onClick={() => router.push(PAGE_ROUTES.budgets)}
              >
                <i className="pi pi-wallet text-4xl text-green-500"></i>
                <h3 className="m-0">Create Budget</h3>
                <p className="text-color-secondary m-0">Set spending limits for categories</p>
              </div>
            </Card>
          </div>
          <div className="col-12 md:col-6 lg:col-3">
            <Card className="shadow-2 h-full cursor-pointer hover:shadow-4 transition-duration-200">
              <div
                className="flex flex-column align-items-center text-center gap-3"
                onClick={() => router.push(PAGE_ROUTES.overview)}
              >
                <i className="pi pi-chart-line text-4xl text-orange-500"></i>
                <h3 className="m-0">View Dashboard</h3>
                <p className="text-color-secondary m-0">See your financial overview</p>
              </div>
            </Card>
          </div>
          <div className="col-12 md:col-6 lg:col-3">
            <Card className="shadow-2 h-full cursor-pointer hover:shadow-4 transition-duration-200">
              <div
                className="flex flex-column align-items-center text-center gap-3"
                onClick={() => router.push(PAGE_ROUTES.feedback)}
              >
                <i className="pi pi-comment text-4xl text-purple-500"></i>
                <h3 className="m-0">Submit Feedback</h3>
                <p className="text-color-secondary m-0">Share your thoughts with us</p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* FAQ Accordion */}
      {filteredFAQ.length > 0 ? (
        filteredFAQ.map((category, catIndex) => (
          <Card key={catIndex} className="shadow-2">
            <div className="flex align-items-center gap-3 mb-3">
              <i className={`pi ${category.icon} text-3xl text-primary`}></i>
              <h2 className="text-2xl font-bold m-0">{category.category}</h2>
              <span className="ml-auto px-3 py-1 border-round bg-primary text-white font-semibold">
                {category.questions.length}
              </span>
            </div>
            <Accordion multiple>
              {category.questions.map((item, qIndex) => (
                <AccordionTab
                  key={qIndex}
                  header={
                    <span className="flex align-items-center gap-2">
                      <i className="pi pi-question-circle text-primary"></i>
                      <span className="font-semibold">{item.question}</span>
                    </span>
                  }
                >
                  <p className="m-0 line-height-3 white-space-pre-line">{item.answer}</p>
                </AccordionTab>
              ))}
            </Accordion>
          </Card>
        ))
      ) : (
        <Card className="shadow-2">
          <div className="flex flex-column align-items-center text-center gap-3 py-6">
            <i className="pi pi-search text-6xl text-400"></i>
            <h3 className="text-2xl m-0">No results found</h3>
            <p className="text-color-secondary m-0">
              Try different keywords or{' '}
              <span
                className="text-primary cursor-pointer font-semibold"
                onClick={() => setSearchTerm('')}
              >
                clear search
              </span>{' '}
              to see all FAQs.
            </p>
          </div>
        </Card>
      )}

      {/* Still Need Help Section */}
      <Card className="shadow-2 bg-primary-50">
        <div className="flex flex-column align-items-center text-center gap-3">
          <i className="pi pi-comments text-5xl text-primary"></i>
          <h2 className="text-3xl font-bold m-0">Still Need Help?</h2>
          <p className="text-xl text-color-secondary m-0" style={{ maxWidth: '600px' }}>
            Can&apos;t find the answer you&apos;re looking for? Our support team is here to help!
          </p>
          <Button
            label="Submit Feedback"
            icon="pi pi-send"
            size="large"
            onClick={() => router.push(PAGE_ROUTES.feedback)}
            className="mt-2"
          />
        </div>
      </Card>
    </div>
  );
};

export default FAQContent;
