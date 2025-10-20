'use client';

import { ProgressBar } from 'primereact/progressbar';

export default function BudgetProgressBar({
  percentageSpent,
  status = 'OnTrack',
  showPercentage = true,
  height = '1.5rem',
  className = ''
}) {
  // Determine color based on status using CSS variables
  const getColor = () => {
    switch (status) {
      case 'OverBudget':
        return 'var(--color-error)';
      case 'Warning':
        return 'var(--color-warning)';
      case 'OnTrack':
      default:
        return 'var(--color-success)';
    }
  };

  // Determine CSS class for text color
  const getColorClass = () => {
    switch (status) {
      case 'OverBudget':
        return 'budget-card-value-error';
      case 'Warning':
        return 'budget-card-value-warning';
      case 'OnTrack':
      default:
        return 'budget-card-value-success';
    }
  };

  // Cap percentage at 100 for display purposes
  const displayPercentage = Math.min(percentageSpent, 100);
  const actualPercentage = Math.round(percentageSpent * 10) / 10; // Round to 1 decimal

  return (
    <div className={`flex flex-column gap-1 ${className}`}>
      <ProgressBar
        value={displayPercentage}
        style={{
          height: height,
          backgroundColor: 'var(--color-gray-200)',
        }}
        color={getColor()}
        showValue={false}
      />
      {showPercentage && (
        <div className="flex justify-content-between align-items-center">
          <span className={`text-sm font-semibold ${getColorClass()}`}>
            {actualPercentage}% spent
          </span>
          {percentageSpent > 100 && (
            <span className="text-xs font-semibold budget-card-value-error">
              Over by {(actualPercentage - 100).toFixed(1)}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}
