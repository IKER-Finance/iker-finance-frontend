'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { selectUser } from '../../../redux/feature/auth-slice';
import { transactionService, budgetService } from '../../../services';
import PAGE_ROUTES from '../../../constants/page-constants';

export default function OverviewPage() {
  const user = useSelector(selectUser);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    activeBudgets: 0,
    recentTransactions: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const [summaryData, transactionsData, budgetsData] = await Promise.all([
        transactionService
          .getTransactionSummary({
            startDate: firstDayOfMonth.toISOString().split('T')[0],
            endDate: lastDayOfMonth.toISOString().split('T')[0],
          })
          .catch((err) => {
            console.error('Summary error:', err);
            return null;
          }),
        transactionService
          .getTransactions({ pageSize: 5, pageNumber: 1 })
          .catch((err) => {
            console.error('Transactions error:', err);
            return { data: [] };
          }),
        budgetService
          .getBudgets({ status: 'Active' })
          .catch((err) => {
            console.error('Budgets error:', err);
            return { totalCount: 0 };
          }),
      ]);

      const income = summaryData?.totalIncome || 0;
      const expenses = summaryData?.totalExpenses || 0;
      const balance = income - expenses;

      setDashboardData({
        totalBalance: balance,
        monthlyIncome: income,
        monthlyExpenses: expenses,
        activeBudgets: budgetsData?.totalCount || 0,
        recentTransactions: transactionsData?.data || [],
      });

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currencyCode = 'SEK') => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderSummaryCard = (title, amount, icon, color, isLoading = false) => {
    return (
      <Card
        className="text-center shadow-3 p-4 border-round-xl h-full transition-transform transition-duration-300 hover:shadow-5 hover:-translate-y-2 backdrop-blur-sm"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        {isLoading ? (
          <>
            <Skeleton height="3rem" className="mb-3"></Skeleton>
            <Skeleton height="2rem" className="mb-2"></Skeleton>
            <Skeleton height="1.5rem"></Skeleton>
          </>
        ) : (
          <>
            <i className={`${icon} text-4xl mb-3`} style={{ color }}></i>
            <h3 className="text-lg md:text-xl font-semibold mb-2">{title}</h3>
            <p className="text-xl md:text-2xl font-bold" style={{ color }}>
              {typeof amount === 'number' ? formatCurrency(amount) : amount}
            </p>
          </>
        )}
      </Card>
    );
  };

  return (
    <div
      className="min-h-screen p-3 md:p-5"
      style={{
        background:
          'linear-gradient(135deg, #eef2ff 0%, #e0f2fe 50%, #fef9c3 100%)',
      }}
    >
      <div className="flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center mb-4 gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-900 mb-1">
            Welcome back, {user?.firstName || 'User'}!
          </h1>
          <p className="text-600 text-base md:text-lg opacity-80">
            Here&apos;s your financial overview
          </p>
        </div>
      </div>

      <div className="grid mb-4">
        <div className="col-12 sm:col-6 lg:col-3">
          {renderSummaryCard(
            'Total Balance',
            dashboardData.totalBalance,
            'pi pi-wallet',
            '#3B82F6',
            loading
          )}
        </div>

        <div className="col-12 sm:col-6 lg:col-3">
          {renderSummaryCard(
            'Monthly Income',
            dashboardData.monthlyIncome,
            'pi pi-arrow-up',
            '#10B981',
            loading
          )}
        </div>

        <div className="col-12 sm:col-6 lg:col-3">
          {renderSummaryCard(
            'Monthly Expenses',
            dashboardData.monthlyExpenses,
            'pi pi-arrow-down',
            '#EF4444',
            loading
          )}
        </div>

        <div className="col-12 sm:col-6 lg:col-3">
          {renderSummaryCard(
            'Active Budgets',
            dashboardData.activeBudgets,
            'pi pi-chart-pie',
            '#8B5CF6',
            loading
          )}
        </div>
      </div>
      
      <div className="grid">
        <div className="col-12">
          <Card
            className="shadow-3 border-round-xl backdrop-blur-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <div className="flex flex-column sm:flex-row justify-content-between align-items-start sm:align-items-center mb-3 gap-2">
              <h3 className="text-lg md:text-xl font-semibold">
                Recent Transactions
              </h3>
              {!loading && dashboardData.recentTransactions.length > 0 && (
                <Button
                  label="View All"
                  icon="pi pi-external-link"
                  text
                  size="small"
                  className="hover:text-primary transition-duration-200"
                  onClick={() => router.push(PAGE_ROUTES.transactions)}
                />
              )}
            </div>

            {loading ? (
              <div>
                <Skeleton height="60px" className="mb-2" />
                <Skeleton height="60px" className="mb-2" />
                <Skeleton height="60px" />
              </div>
            ) : dashboardData.recentTransactions.length === 0 ? (
              <div className="text-center py-5">
                <i className="pi pi-info-circle text-4xl text-400 mb-3"></i>
                <p className="text-600 text-base md:text-lg">
                  No transactions yet.
                </p>
                <Button
                  label="Add Your First Transaction"
                  icon="pi pi-plus"
                  className="mt-3"
                  onClick={() => router.push(PAGE_ROUTES.addTransaction)}
                />
              </div>
            ) : (
              <div className="overflow-auto">
                {dashboardData.recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex flex-column sm:flex-row justify-content-between align-items-start sm:align-items-center p-3 border-bottom-1 border-200 cursor-pointer hover:surface-100 transition-duration-200 border-round-sm"
                    style={{
                      background: 'rgba(255, 255, 255, 0.5)',
                      backdropFilter: 'blur(4px)',
                    }}
                    onClick={() =>
                      router.push(
                        `${PAGE_ROUTES.transactions}/${transaction.id}`
                      )
                    }
                  >
                    <div>
                      <p className="font-semibold text-900 m-0">
                        {transaction.description || 'No description'}
                      </p>
                      <p className="text-sm text-600 mt-1 mb-0">
                        {formatDate(transaction.date)} •{' '}
                        {transaction.categoryName || 'Uncategorized'}
                      </p>
                    </div>
                    <div
                      className="mt-2 sm:mt-0 text-lg font-bold"
                      style={{
                        color:
                          transaction.type === 'Income'
                            ? '#10B981'
                            : '#EF4444',
                      }}
                    >
                      {transaction.type === 'Income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
