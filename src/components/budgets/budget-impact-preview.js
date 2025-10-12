'use client';

import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import BudgetStatusBadge from './budget-status-badge';

export default function BudgetImpactPreview({ impactData, loading = false }) {
  if (loading) {
    return (
      <Card className="mt-3">
        <div className="flex align-items-center gap-2 mb-2">
          <i className="pi pi-spin pi-spinner text-primary"></i>
          <span className="text-600">Calculating budget impact...</span>
        </div>
      </Card>
    );
  }

  if (!impactData || !impactData.affectedBudgets || impactData.affectedBudgets.length === 0) {
    return null;
  }

  const formatCurrency = (amount, currencyCode, currencySymbol) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card className="mt-3 surface-50">
      <div className="flex align-items-center gap-2 mb-3">
        <i className="pi pi-chart-line text-xl text-primary"></i>
        <h4 className="text-lg font-semibold m-0">Budget Impact Preview</h4>
      </div>

      {/* Warnings Section */}
      {impactData.hasWarnings && impactData.warnings.length > 0 && (
        <div className="mb-3">
          {impactData.warnings.map((warning, index) => (
            <Message
              key={index}
              severity="warn"
              text={warning}
              className="w-full mb-2"
            />
          ))}
        </div>
      )}

      {/* Affected Budgets */}
      <div className="flex flex-column gap-3">
        {impactData.affectedBudgets.map((budget) => (
          <div
            key={budget.budgetId}
            className="p-3 border-round surface-0 border-1 surface-border"
          >
            <div className="flex justify-content-between align-items-start mb-2">
              <div>
                <h5 className="text-base font-semibold m-0 mb-1">{budget.budgetName}</h5>
                <span className="text-xs text-500">
                  {budget.currencySymbol} {budget.currencyCode}
                </span>
              </div>
              <div className="flex gap-2">
                <BudgetStatusBadge status={budget.statusBefore} size="small" />
                {budget.statusBefore !== budget.statusAfter && (
                  <>
                    <i className="pi pi-arrow-right text-sm text-500"></i>
                    <BudgetStatusBadge status={budget.statusAfter} size="small" />
                  </>
                )}
              </div>
            </div>

            {/* Before and After Comparison */}
            <div className="grid">
              <div className="col-6">
                <div className="text-xs text-500 mb-1">Current</div>
                <div className="text-sm">
                  <div className="font-semibold">
                    {formatCurrency(budget.currentSpent, budget.currencyCode, budget.currencySymbol)}
                  </div>
                  <div className="text-xs text-600">
                    {budget.currentPercentage.toFixed(1)}% spent
                  </div>
                </div>
              </div>
              <div className="col-6 text-right">
                <div className="text-xs text-500 mb-1">After Transaction</div>
                <div className="text-sm">
                  <div
                    className="font-semibold"
                    style={{
                      color: budget.statusAfter === 'OverBudget' ? '#EF4444' :
                             budget.statusAfter === 'Warning' ? '#F59E0B' : '#10B981'
                    }}
                  >
                    {formatCurrency(budget.afterSpent, budget.currencyCode, budget.currencySymbol)}
                  </div>
                  <div className="text-xs text-600">
                    {budget.afterPercentage.toFixed(1)}% spent
                  </div>
                </div>
              </div>
            </div>

            <Divider className="my-2" />

            {/* Remaining Amount */}
            <div className="flex justify-content-between align-items-center">
              <span className="text-sm text-600">Remaining:</span>
              <span
                className="text-sm font-semibold"
                style={{
                  color: budget.afterRemaining >= 0 ? '#10B981' : '#EF4444'
                }}
              >
                {formatCurrency(budget.afterRemaining, budget.currencyCode, budget.currencySymbol)}
              </span>
            </div>

            {/* Category Impact */}
            {budget.affectedCategory && (
              <>
                <Divider className="my-2" />
                <div className="p-2 surface-100 border-round">
                  <div className="text-xs font-semibold text-700 mb-1">
                    Category: {budget.affectedCategory.categoryName}
                  </div>
                  <div className="flex justify-content-between text-xs">
                    <span className="text-600">Allocated:</span>
                    <span>
                      {formatCurrency(budget.affectedCategory.allocated, budget.currencyCode, budget.currencySymbol)}
                    </span>
                  </div>
                  <div className="flex justify-content-between text-xs">
                    <span className="text-600">After spending:</span>
                    <span
                      className={budget.affectedCategory.willExceed ? 'text-red-500 font-semibold' : ''}
                    >
                      {formatCurrency(budget.affectedCategory.afterSpent, budget.currencyCode, budget.currencySymbol)}
                      {budget.affectedCategory.willExceed && ' ⚠️'}
                    </span>
                  </div>
                  {budget.affectedCategory.willExceed && (
                    <div className="flex justify-content-between text-xs mt-1">
                      <span className="text-red-500 font-semibold">Exceeds by:</span>
                      <span className="text-red-500 font-semibold">
                        {formatCurrency(budget.affectedCategory.exceedAmount, budget.currencyCode, budget.currencySymbol)}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Alert Message */}
            {budget.willTriggerAlert && budget.alertMessage && (
              <Message
                severity={budget.statusAfter === 'OverBudget' ? 'error' : 'warn'}
                text={budget.alertMessage}
                className="w-full mt-2"
              />
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-3 p-2 surface-100 border-round text-sm">
        <div className="flex justify-content-between">
          <span className="text-600">
            {impactData.affectedBudgets.length} {impactData.affectedBudgets.length === 1 ? 'budget' : 'budgets'} affected
          </span>
          {impactData.hasWarnings && (
            <span className="text-orange-500 font-semibold">
              <i className="pi pi-exclamation-triangle mr-1"></i>
              Review warnings before saving
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
