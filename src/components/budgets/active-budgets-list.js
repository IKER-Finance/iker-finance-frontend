'use client';

import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import BudgetProgressBar from './budget-progress-bar';
import BudgetStatusBadge from './budget-status-badge';

export default function ActiveBudgetsList({
  budgets = [],
  loading = false,
  onViewAll,
  maxDisplay = 5
}) {
  const formatCurrency = (amount, currencyCode, currencySymbol) => {
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

  const displayBudgets = budgets.slice(0, maxDisplay);

  return (
    <Card>
      <div className="flex justify-content-between align-items-center mb-3">
        <h3 className="text-xl font-semibold m-0">Active Budgets</h3>
        {!loading && budgets.length > 0 && (
          <Button
            label="View All"
            icon="pi pi-external-link"
            text
            onClick={onViewAll}
          />
        )}
      </div>

      {loading ? (
        <div>
          <Skeleton height="80px" className="mb-3" />
          <Skeleton height="80px" className="mb-3" />
          <Skeleton height="80px" />
        </div>
      ) : budgets.length === 0 ? (
        <div className="text-center py-4">
          <i className="pi pi-info-circle text-4xl text-400 mb-3"></i>
          <p className="text-600 text-lg">No active budgets.</p>
          <Button
            label="Create Your First Budget"
            icon="pi pi-plus"
            className="mt-3"
            onClick={onViewAll}
          />
        </div>
      ) : (
        <div className="flex flex-column gap-3">
          {displayBudgets.map((budget) => (
            <div
              key={budget.id}
              className="p-3 border-round surface-50 border-1 surface-border hover:surface-100 transition-colors transition-duration-200"
            >
              <div className="flex justify-content-between align-items-start mb-2">
                <div className="flex-1">
                  <div className="flex align-items-center gap-2 mb-1">
                    <h4 className="text-lg font-semibold m-0">{budget.categoryName}</h4>
                    <BudgetStatusBadge status={budget.status} size="small" />
                  </div>
                  <p className="text-sm text-600 m-0">
                    {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold m-0">
                    {formatCurrency(budget.amount, budget.currencyCode, budget.currencySymbol)}
                  </p>
                  <p className="text-xs text-600 m-0">
                    {formatCurrency(budget.remainingAmount, budget.currencyCode, budget.currencySymbol)} left
                  </p>
                </div>
              </div>

              <BudgetProgressBar
                percentageSpent={budget.percentageSpent}
                status={budget.status}
                showPercentage={true}
                height="1.25rem"
              />
            </div>
          ))}

          {budgets.length > maxDisplay && (
            <div className="text-center pt-2">
              <Button
                label={`View ${budgets.length - maxDisplay} More Budgets`}
                icon="pi pi-arrow-right"
                text
                onClick={onViewAll}
                className="font-semibold"
              />
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
