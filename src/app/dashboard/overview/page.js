'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Skeleton } from 'primereact/skeleton';
import { selectUser } from '../../../redux/feature/auth-slice';
import { apiClient } from '../../../services';
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
    budgetStatus: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // For now, we'll set static data until we implement the transaction/budget services
      setTimeout(() => {
        setDashboardData({
          totalBalance: 0,
          monthlyIncome: 0,
          monthlyExpenses: 0,
          activeBudgets: 0,
          recentTransactions: [],
          budgetStatus: []
        });
        setLoading(false);
      }, 1000);
      
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

  const renderSummaryCard = (title, amount, icon, color, isLoading = false) => {
    return (
      <Card className="text-center">
        {isLoading ? (
          <>
            <Skeleton height="3rem" className="mb-3"></Skeleton>
            <Skeleton height="2rem" className="mb-2"></Skeleton>
            <Skeleton height="1.5rem"></Skeleton>
          </>
        ) : (
          <>
            <i className={`${icon} text-4xl mb-3`} style={{ color }}></i>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-2xl font-bold" style={{ color }}>
              {typeof amount === 'number' ? formatCurrency(amount) : amount}
            </p>
          </>
        )}
      </Card>
    );
  };

  return (
    <div className="surface-ground min-h-screen">
      <div className="p-4">
        <div className="flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-900 mb-1">
              Welcome back, {user?.firstName || 'User'}!
            </h1>
            <p className="text-600 text-lg">Here&apos;s your financial overview</p>
          </div>
          <Button 
            label="Add Transaction" 
            icon="pi pi-plus" 
            onClick={() => router.push(PAGE_ROUTES.addTransaction)}
          />
        </div>

        {/* Summary Cards */}
        <div className="grid mb-4">
          <div className="col-12 md:col-6 lg:col-3">
            {renderSummaryCard(
              'Total Balance',
              dashboardData.totalBalance,
              'pi pi-wallet',
              '#3B82F6',
              loading
            )}
          </div>
          
          <div className="col-12 md:col-6 lg:col-3">
            {renderSummaryCard(
              'Monthly Income',
              dashboardData.monthlyIncome,
              'pi pi-arrow-up',
              '#10B981',
              loading
            )}
          </div>
          
          <div className="col-12 md:col-6 lg:col-3">
            {renderSummaryCard(
              'Monthly Expenses',
              dashboardData.monthlyExpenses,
              'pi pi-arrow-down',
              '#EF4444',
              loading
            )}
          </div>
          
          <div className="col-12 md:col-6 lg:col-3">
            {renderSummaryCard(
              'Active Budgets',
              dashboardData.activeBudgets,
              'pi pi-chart-pie',
              '#8B5CF6',
              loading
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="grid">
          <div className="col-12">
            <Card>
              <div className="flex justify-content-between align-items-center mb-3">
                <h3 className="text-xl font-semibold">Recent Transactions</h3>
                <Button 
                  label="View All" 
                  icon="pi pi-external-link" 
                  text 
                  onClick={() => router.push(PAGE_ROUTES.transactions)}
                />
              </div>
              
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
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}