import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Clock, User, MapPin } from 'lucide-react';
import { FloorplanSubmission } from '../../types';
import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';

interface FloorplanCardProps {
  submission: FloorplanSubmission;
}

export const FloorplanCard: React.FC<FloorplanCardProps> = ({ submission }) => {
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <Card hover className="transition-all duration-200">
      <div className="flex items-start space-x-4">
        {/* Floorplan thumbnail */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={submission.imageUrl}
              alt="Floorplan thumbnail"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNSAzNUwzNSAyNUw0NSAzNUw1NSAyNVY1NUgzNVY0NUgyNVYzNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <StatusBadge status={submission.status} size="sm" />
            <span className="text-sm text-gray-500">
              ID: {submission.id.slice(-8)}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-2" />
              <span className="font-medium">{submission.userDetails.fullName}</span>
            </div>

            {submission.location && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{submission.location}</span>
              </div>
            )}

            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span>Submitted {formatDate(submission.submittedAt)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(submission.estimatedCost)}
            </div>
            <Button
              size="sm"
              icon={Eye}
              onClick={() => navigate(`/admin/floorplan/${submission.id}`)}
            >
              Review
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};