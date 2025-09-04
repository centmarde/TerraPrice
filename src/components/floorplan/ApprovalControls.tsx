import React, { useState } from 'react';
import { Check, X} from 'lucide-react';
import { FloorplanSubmission } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface ApprovalControlsProps {
  submission: FloorplanSubmission;
  onStatusUpdate: (status: FloorplanSubmission['status'], notes?: string) => void;
  isLoading?: boolean;
}

export const ApprovalControls: React.FC<ApprovalControlsProps> = ({
  submission,
  onStatusUpdate,
  isLoading = false
}) => {
  const [notes, setNotes] = useState(submission.adminNotes || '');
  const [showNotesInput, setShowNotesInput] = useState(false);

  const handleApprove = () => {
    onStatusUpdate('approved', notes || undefined);
  };

  const handleReject = () => {
    if (!notes.trim()) {
      setShowNotesInput(true);
      return;
    }
    onStatusUpdate('rejected', notes);
  };

  const quickRejectReasons = [
    'Incomplete floorplan',
    'Poor image quality',
    'Missing dimensions',
    'Invalid format'
  ];

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Review Actions
          </h3>
          <div className="text-sm text-gray-500">
            Status: <span className="font-medium">{submission.status}</span>
          </div>
        </div>

        {/* Quick reject buttons */}
        {submission.status === 'pending' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Rejection Reasons:
            </label>
            <div className="flex flex-wrap gap-2">
              {quickRejectReasons.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setNotes(reason)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notes section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Admin Notes
            </label>
            <button
              onClick={() => setShowNotesInput(!showNotesInput)}
              className="text-sm text-teal-600 hover:text-teal-700"
            >
              {showNotesInput ? 'Hide' : 'Add Notes'}
            </button>
          </div>
          
          {(showNotesInput || notes) && (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your review notes here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
              rows={3}
            />
          )}

          {submission.adminNotes && submission.adminNotes !== notes && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Previous notes:</strong> {submission.adminNotes}
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        {submission.status === 'pending' && (
          <div className="flex space-x-3">
            <Button
              variant="success"
              icon={Check}
              onClick={handleApprove}
              disabled={isLoading}
              fullWidth
            >
              Approve Submission
            </Button>
            <Button
              variant="danger"
              icon={X}
              onClick={handleReject}
              disabled={isLoading}
              fullWidth
            >
              Reject Submission
            </Button>
          </div>
        )}

        {submission.status !== 'pending' && (
          <div className="text-center py-4">
            <p className="text-gray-600">
              This submission has been {submission.status}.
            </p>
            {submission.reviewedAt && (
              <p className="text-sm text-gray-500 mt-1">
                Reviewed on {new Date(submission.reviewedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};