'use client';

import { Tag } from 'primereact/tag';

export default function BudgetStatusBadge({ status = 'OnTrack', size = 'normal' }) {
  // Map status to PrimeReact severity
  const getSeverity = () => {
    switch (status) {
      case 'OverBudget':
        return 'danger';
      case 'Warning':
        return 'warning';
      case 'OnTrack':
      default:
        return 'success';
    }
  };

  // Format status text for display
  const getStatusText = () => {
    switch (status) {
      case 'OverBudget':
        return 'Over Budget';
      case 'Warning':
        return 'Warning';
      case 'OnTrack':
      default:
        return 'On Track';
    }
  };

  // Get icon based on status
  const getIcon = () => {
    switch (status) {
      case 'OverBudget':
        return 'pi pi-exclamation-triangle';
      case 'Warning':
        return 'pi pi-exclamation-circle';
      case 'OnTrack':
      default:
        return 'pi pi-check-circle';
    }
  };

  return (
    <Tag
      value={getStatusText()}
      severity={getSeverity()}
      icon={getIcon()}
      className={size === 'small' ? 'text-xs' : ''}
    />
  );
}
