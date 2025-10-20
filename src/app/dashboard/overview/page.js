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
import BudgetSummaryCards from '../../../components/budgets/budget-summary-cards';
import ActiveBudgetsList from '../../../components/budgets/active-budgets-list';
import BudgetAlerts from '../../../components/budgets/budget-alerts';
import styles from '../OverviewPage.module.css'; 

export default function OverviewPage() {
  const user = useSelector(selectUser);
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [budgetLoading, setBudgetLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalSpent: 0,
    budgetsOnTrack: 0,
    totalBudgets: 0,
    lastMonthSpent: 0,
    spendingChange: 0,
    spendingChangePercent: 0,
    currenciesUsed: [],
    recentTransactions: [],
    homeCurrencyCode: 'SEK',
    homeCurrencySymbol: 'kr',
  });
  const [activeBudgetsData, setActiveBudgetsData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchActiveBudgets();
  }, []);

  // Update budgets on track when activeBudgetsData changes
  useEffect(() => {
    if (activeBudgetsData && activeBudgetsData.budgets) {
      const onTrack = activeBudgetsData.budgets.filter(
        budget => budget.utilizationPercentage < 80
      ).length;

      setDashboardData(prev => ({
        ...prev,
        budgetsOnTrack: onTrack,
        totalBudgets: activeBudgetsData.totalBudgets || 0,
      }));
    }
  }, [activeBudgetsData]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // Last month dates
      const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      const [currentMonthSummary, lastMonthSummary, transactionsData, budgetsData] = await Promise.all([
        transactionService.getTransactionSummary({
          startDate: firstDayOfMonth.toISOString().split('T')[0],
          endDate: lastDayOfMonth.toISOString().split('T')[0]
        }).catch(err => {
          console.error('Current month summary error:', err);
          return null;
        }),
        transactionService.getTransactionSummary({
          startDate: firstDayOfLastMonth.toISOString().split('T')[0],
          endDate: lastDayOfLastMonth.toISOString().split('T')[0]
        }).catch(err => {
          console.error('Last month summary error:', err);
          return null;
        }),
        transactionService.getTransactions({ pageSize: 5, pageNumber: 1 }).catch(err => {
          console.error('Transactions error:', err);
          return { data: [] };
        }),
        budgetService.getBudgets({ status: 'Active' }).catch(err => {
          console.error('Budgets error:', err);
          return { totalCount: 0 };
        })
      ]);

      const totalSpent = currentMonthSummary?.totalExpenses || 0;
      const lastMonthSpent = lastMonthSummary?.totalExpenses || 0;
      const spendingChange = totalSpent - lastMonthSpent;
      const spendingChangePercent = lastMonthSpent > 0
        ? ((spendingChange / lastMonthSpent) * 100)
        : 0;

      // Extract unique currencies from transactions
      const currencies = [...new Set(
        (transactionsData?.data || [])
          .map(t => t.currencyCode)
          .filter(Boolean)
      )];

      setDashboardData({
        totalSpent,
        budgetsOnTrack: 0, // Will be calculated from activeBudgetsData
        totalBudgets: budgetsData?.totalCount || 0,
        lastMonthSpent,
        spendingChange,
        spendingChangePercent,
        currenciesUsed: currencies,
        recentTransactions: transactionsData?.data || [],
        homeCurrencyCode: currentMonthSummary?.homeCurrencyCode || 'SEK',
        homeCurrencySymbol: currentMonthSummary?.homeCurrencySymbol || 'kr',
      });

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setLoading(false);
    }
  };

  const fetchActiveBudgets = async () => {
    try {
      setBudgetLoading(true);
      const budgetsData = await budgetService.getActiveBudgets(true);
      setActiveBudgetsData(budgetsData);
      setBudgetLoading(false);
    } catch (error) {
      console.error('Failed to fetch active budgets:', error);
      setBudgetLoading(false);
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
      day: 'numeric'
    });
  };

  return (
    <div className={`${styles.pageContainer} surface-ground min-h-screen`}>
      <div className="p-4">
        <div className="flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-900 mb-1">
              Welcome back, {user?.firstName || 'User'}!
            </h1>
            <p className="text-600 text-lg">Here&apos;s your financial overview</p>
          </div>
        </div>

        <div className="grid mb-4">
          {/* Card 1: Total Spent This Month */}
          <div className="col-12 md:col-6 lg:col-3">
            <Card className="text-center">
              {loading ? (
                <>
                  <Skeleton height="3rem" className="mb-3"></Skeleton>
                  <Skeleton height="2rem" className="mb-2"></Skeleton>
                  <Skeleton height="1.5rem"></Skeleton>
                </>
              ) : (
                <>
                  <i className="pi pi-wallet text-4xl mb-3" style={{ color: '#EF4444' }}></i>
                  <h3 className="text-xl font-semibold mb-2">Total Spent</h3>
                  <p className="text-2xl font-bold" style={{ color: '#EF4444' }}>
                    {formatCurrency(dashboardData.totalSpent, dashboardData.homeCurrencyCode)}
                  </p>
                  <p className="text-sm text-500 mt-2">This month</p>
                </>
              )}
            </Card>
          </div>

          {/* Card 2: Budget Status */}
          <div className="col-12 md:col-6 lg:col-3">
            <Card className="text-center">
              {loading || budgetLoading ? (
                <>
                  <Skeleton height="3rem" className="mb-3"></Skeleton>
                  <Skeleton height="2rem" className="mb-2"></Skeleton>
                  <Skeleton height="1.5rem"></Skeleton>
                </>
              ) : (
                <>
                  <i className="pi pi-chart-pie text-4xl mb-3" style={{ color: '#8B5CF6' }}></i>
                  <h3 className="text-xl font-semibold mb-2">Budget Status</h3>
                  <p className="text-2xl font-bold" style={{ color: '#8B5CF6' }}>
                    {dashboardData.budgetsOnTrack} of {dashboardData.totalBudgets}
                  </p>
                  <p className="text-sm text-500 mt-2">
                    {dashboardData.totalBudgets > 0
                      ? `${Math.round((dashboardData.budgetsOnTrack / dashboardData.totalBudgets) * 100)}% on track`
                      : 'No budgets set'
                    }
                  </p>
                </>
              )}
            </Card>
          </div>

          {/* Card 3: vs Last Month */}
          <div className="col-12 md:col-6 lg:col-3">
            <Card className="text-center">
              {loading ? (
                <>
                  <Skeleton height="3rem" className="mb-3"></Skeleton>
                  <Skeleton height="2rem" className="mb-2"></Skeleton>
                  <Skeleton height="1.5rem"></Skeleton>
                </>
              ) : (
                <>
                  <i
                    className={`pi ${dashboardData.spendingChange > 0 ? 'pi-arrow-up' : 'pi-arrow-down'} text-4xl mb-3`}
                    style={{ color: dashboardData.spendingChange > 0 ? '#EF4444' : '#10B981' }}
                  ></i>
                  <h3 className="text-xl font-semibold mb-2">vs Last Month</h3>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: dashboardData.spendingChange > 0 ? '#EF4444' : '#10B981' }}
                  >
                    {dashboardData.spendingChange > 0 ? '+' : ''}
                    {formatCurrency(Math.abs(dashboardData.spendingChange), dashboardData.homeCurrencyCode)}
                  </p>
                  <p className="text-sm text-500 mt-2">
                    {dashboardData.lastMonthSpent > 0
                      ? `${dashboardData.spendingChange > 0 ? '↑' : '↓'} ${Math.abs(dashboardData.spendingChangePercent).toFixed(1)}%`
                      : 'No previous data'
                    }
                  </p>
                </>
              )}
            </Card>
          </div>

          {/* Card 4: Currencies Used */}
          <div className="col-12 md:col-6 lg:col-3">
            <Card className="text-center">
              {loading ? (
                <>
                  <Skeleton height="3rem" className="mb-3"></Skeleton>
                  <Skeleton height="2rem" className="mb-2"></Skeleton>
                  <Skeleton height="1.5rem"></Skeleton>
                </>
              ) : (
                <>
                  <i className="pi pi-globe text-4xl mb-3" style={{ color: '#3B82F6' }}></i>
                  <h3 className="text-xl font-semibold mb-2">Currencies Used</h3>
                  <p className="text-2xl font-bold" style={{ color: '#3B82F6' }}>
                    {dashboardData.currenciesUsed.length || 0}
                  </p>
                  <p className="text-sm text-500 mt-2">
                    {dashboardData.currenciesUsed.length > 0
                      ? dashboardData.currenciesUsed.join(', ')
                      : 'No transactions yet'
                    }
                  </p>
                </>
              )}
            </Card>
          </div>
        </div>

        {/* Budget Summary Section */}
        {activeBudgetsData && activeBudgetsData.totalBudgets > 0 && (
          <>
            <div className="mb-3">
              <h2 className="text-2xl font-bold text-900 mb-1">Budget Overview</h2>
              <p className="text-600">Track your spending against budgets</p>
            </div>

            <BudgetSummaryCards
              budgetData={activeBudgetsData}
              loading={budgetLoading}
              homeCurrencyCode={activeBudgetsData?.homeCurrencyCode}
              homeCurrencySymbol={activeBudgetsData?.homeCurrencySymbol}
            />

            <div className="grid mt-4 mb-4">
              {activeBudgetsData?.budgetsWarning + activeBudgetsData?.budgetsOverBudget > 0 && (
                <div className="col-12 lg:col-4">
                  <BudgetAlerts
                    budgets={activeBudgetsData?.budgets || []}
                    loading={budgetLoading}
                  />
                </div>
              )}
              <div className={activeBudgetsData?.budgetsWarning + activeBudgetsData?.budgetsOverBudget > 0 ? 'col-12 lg:col-8' : 'col-12'}>
                <ActiveBudgetsList
                  budgets={activeBudgetsData?.budgets || []}
                  loading={budgetLoading}
                  onViewAll={() => router.push(PAGE_ROUTES.budgets)}
                  maxDisplay={5}
                />
              </div>
            </div>
          </>
        )}

        <div className="grid">
          <div className="col-12">
            <Card>
              <div className="flex justify-content-between align-items-center mb-3">
                <h3 className="text-xl font-semibold">Recent Transactions</h3>
                {!loading && dashboardData.recentTransactions.length > 0 && (
                  <Button 
                    label="View All" 
                    icon="pi pi-external-link" 
                    text 
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
                <div className="text-center py-4">
                  <i className="pi pi-info-circle text-4xl text-400 mb-3"></i>
                  <p className="text-600 text-lg">No transactions yet.</p>
                  <Button 
                    label="Add Your First Transaction" 
                    icon="pi pi-plus" 
                    className="mt-3"
                    onClick={() => router.push(PAGE_ROUTES.addTransaction)}
                  />
                </div>
              ) : (
                <div>
                  {dashboardData.recentTransactions.map((transaction) => (
                    <div 
                      key={transaction.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        borderBottom: '1px solid #e2e8f0',
                        cursor: 'pointer'
                      }}
                      onClick={() => router.push(`${PAGE_ROUTES.transactions}/${transaction.id}`)}
                    >
                      <div>
                        <p style={{ fontWeight: 600, margin: 0 }}>
                          {transaction.description || 'No description'}
                        </p>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                          {formatDate(transaction.date)} • {transaction.categoryName || 'Uncategorized'}
                        </p>
                      </div>
                      <div style={{
                        fontWeight: 700,
                        color: '#EF4444'
                      }}>
                        -{formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}