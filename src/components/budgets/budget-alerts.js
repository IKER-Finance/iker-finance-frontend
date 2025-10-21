'use client';

import { Card } from 'primereact/card';
import { Message } from 'primereact/message';

export default function BudgetAlerts({ budgets = [], loading = false }) {
  if (loading) {
    return null;
  }

  // Filter budgets that need alerts
  const overBudgetBudgets = budgets.filter(b => b.status === 'OverBudget');
  const warningBudgets = budgets.filter(b => b.status === 'Warning');

  // No alerts to show
  if (overBudgetBudgets.length === 0 && warningBudgets.length === 0) {
    return null;
  }

  const formatCurrency = (amount, currencyCode) => {
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
    <Card>
      <div className="flex align-items-center gap-2 mb-3">
        <i className="pi pi-exclamation-triangle text-2xl text-orange-500"></i>
        <h3 className="text-xl font-semibold m-0">Budget Alerts</h3>
      </div>

      <div className="flex flex-column gap-2">
        {overBudgetBudgets.map((budget) => (
          <Message
            key={budget.id}
            severity="error"
            text={
              <div>
                <div>
                  <strong>{budget.categoryName || budget.name}</strong> is over budget by{' '}
                  {formatCurrency(Math.abs(budget.remainingAmount), budget.currencyCode)}
                  {' '}({(budget.percentageSpent - 100).toFixed(1)}%)
                </div>
                <div className="text-sm mt-1" style={{ opacity: 0.9 }}>
                  {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
                </div>
              </div>
            }
            className="w-full"
          />
        ))}

        {warningBudgets.map((budget) => (
          <Message
            key={budget.id}
            severity="warn"
            text={
              <div>
                <div>
                  <strong>{budget.categoryName || budget.name}</strong> is at{' '}
                  {budget.percentageSpent.toFixed(1)}% spent with{' '}
                  {formatCurrency(budget.remainingAmount, budget.currencyCode)} remaining
                </div>
                <div className="text-sm mt-1" style={{ opacity: 0.9 }}>
                  {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
                </div>
              </div>
            }
            className="w-full"
          />
        ))}
      </div>

      <div className="mt-3 p-2 surface-100 border-round">
        <div className="flex justify-content-between text-sm">
          <span className="text-600">Summary:</span>
          <span className="font-semibold">
            {overBudgetBudgets.length} over budget, {warningBudgets.length} approaching limit
          </span>
        </div>
      </div>
    </Card>
  );
}
