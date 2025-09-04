import React from 'react';
import { FloorplanSubmission } from '../../types';

interface StatusBadgeProps {
  status: FloorplanSubmission['status'];
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  const statusConfig = {
    pending: {
      classes: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      label: 'Pending Review'
    },
    approved: {
      classes: 'bg-green-100 text-green-800 border border-green-200',
      label: 'Approved'
    },
    rejected: {
      classes: 'bg-red-100 text-red-800 border border-red-200',
      label: 'Rejected'
    }
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${sizeClasses[size]} ${config.classes}`}>
      {config.label}
    </span>
  );
};