'use client';

import { Card } from 'primereact/card';
import { Skeleton } from 'primereact/skeleton';

export default function BudgetSummaryCards({
  budgetData,
  loading = false,
  homeCurrencyCode = 'SEK',
  homeCurrencySymbol = 'kr'
}) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: homeCurrencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const renderCard = (title, value, icon, colorClass, subtext = null, isCount = false) => {
    return (
      <Card className="text-center">
        {loading ? (
          <>
            <Skeleton height="3rem" className="mb-3" />
            <Skeleton height="2rem" className="mb-2" />
            <Skeleton height="1.5rem" />
          </>
        ) : (
          <>
            <i className={`${icon} text-4xl mb-3 budget-card-icon-${colorClass}`} />
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className={`text-2xl font-bold mb-1 budget-card-value-${colorClass}`}>
              {isCount ? value : (typeof value === 'number' ? formatCurrency(value) : value)}
            </p>
            {subtext && (
              <p className="text-sm text-600 mt-2">{subtext}</p>
            )}
          </>
        )}
      </Card>
    );
  };

  if (!budgetData) {
    return null;
  }

  const totalBudgeted = budgetData.totalBudgetedAmount || 0;
  const totalSpent = budgetData.totalSpentAmount || 0;
  const remaining = totalBudgeted - totalSpent;
  const percentageSpent = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  return (
    <div className="grid">
      <div className="col-12 md:col-6 lg:col-3">
        {renderCard(
          'Total Budgeted',
          totalBudgeted,
          'pi pi-wallet',
          'primary',
          `${budgetData.totalBudgets || 0} active ${budgetData.totalBudgets === 1 ? 'budget' : 'budgets'}`
        )}
      </div>

      <div className="col-12 md:col-6 lg:col-3">
        {renderCard(
          'Total Spent',
          totalSpent,
          'pi pi-arrow-down',
          'error',
          `${percentageSpent.toFixed(1)}% of budget used`
        )}
      </div>

      <div className="col-12 md:col-6 lg:col-3">
        {renderCard(
          'Remaining',
          remaining,
          remaining >= 0 ? 'pi pi-check-circle' : 'pi pi-exclamation-triangle',
          remaining >= 0 ? 'success' : 'error',
          remaining >= 0 ? 'Available to spend' : 'Over budget'
        )}
      </div>

      <div className="col-12 md:col-6 lg:col-3">
        {renderCard(
          'Budgets at Risk',
          budgetData.budgetsWarning + budgetData.budgetsOverBudget,
          'pi pi-exclamation-circle',
          (budgetData.budgetsWarning + budgetData.budgetsOverBudget) > 0 ? 'warning' : 'success',
          `${budgetData.budgetsOverBudget || 0} over, ${budgetData.budgetsWarning || 0} warning`,
          true
        )}
      </div>
    </div>
  );
}
