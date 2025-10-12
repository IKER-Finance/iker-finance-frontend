'use client';

import { ProgressBar } from 'primereact/progressbar';

export default function BudgetProgressBar({
  percentageSpent,
  status = 'OnTrack',
  showPercentage = true,
  height = '1.5rem',
  className = ''
}) {
  // Determine color based on status
  const getColor = () => {
    switch (status) {
      case 'OverBudget':
        return '#EF4444'; // Red
      case 'Warning':
        return '#F59E0B'; // Orange
      case 'OnTrack':
      default:
        return '#10B981'; // Green
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
          backgroundColor: '#E5E7EB',
        }}
        color={getColor()}
        showValue={false}
      />
      {showPercentage && (
        <div className="flex justify-content-between align-items-center">
          <span
            className="text-sm font-semibold"
            style={{ color: getColor() }}
          >
            {actualPercentage}% spent
          </span>
          {percentageSpent > 100 && (
            <span className="text-xs text-red-500 font-semibold">
              Over by {(actualPercentage - 100).toFixed(1)}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}
