import React, { useState } from 'react';
import { Check, X, Undo2, Clock } from 'lucide-react';
import { FloorplanSubmission } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { DenialDialog } from '../ui/DenialDialog';
import { useFloorplanStore } from '../../stores/floorplanStore';
import { formatPhilippineDate } from '../../utils/dateUtils';

interface ApprovalControlsProps {
  submission: FloorplanSubmission;
  onStatusUpdate: (status: FloorplanSubmission['status'], notes?: string, denialReason?: string) => void;
  isLoading?: boolean;
}

export const ApprovalControls: React.FC<ApprovalControlsProps> = ({
  submission,
  onStatusUpdate,
  isLoading = false
}) => {
  const { recentActions = [], undoStatusChange } = useFloorplanStore();
  const [notes, setNotes] = useState(submission.adminNotes || '');
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [showDenialDialog, setShowDenialDialog] = useState(false);

  // Find if there's a recent undoable action for this submission
  const undoableAction = recentActions.find(
    action => action.submissionId === submission.id && action.canUndo
  );

  const handleApprove = () => {
    onStatusUpdate('approved', notes || undefined);
  };

  const handleDenyClick = () => {
    setShowDenialDialog(true);
  };

  const handleDenyConfirm = (denialReason: string) => {
    onStatusUpdate('denied', notes || undefined, denialReason);
    setShowDenialDialog(false);
  };

  const handleUndo = async () => {
    if (undoableAction) {
      try {
        await undoStatusChange(submission.id);
      } catch (error) {
        console.error('Failed to undo action:', error);
      }
    }
  };

  const quickRejectReasons = [
    'Incomplete floorplan',
    'Poor image quality',
    'Missing dimensions',
    'Invalid format'
  ];

  return (
    <>
      <Card>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Review Actions
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Status: <span className="font-medium capitalize">{submission.status}</span>
            </div>
          </div>

          {/* Undo Section - Show if there's a recent action */}
          {undoableAction && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Recent Action
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Changed from "{undoableAction.previousStatus}" to "{undoableAction.newStatus}"
                      {' '}{new Date(undoableAction.timestamp).toLocaleTimeString('en-US', { timeZone: 'Asia/Manila' })}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Undo2}
                  onClick={handleUndo}
                  disabled={isLoading}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/30 w-full sm:w-auto"
                >
                  Undo
                </Button>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                You can undo this action within 5 minutes of making it.
              </p>
            </div>
          )}

          {/* Quick deny buttons */}
          {submission.status === 'pending' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quick Denial Reasons:
              </label>
              <div className="flex flex-wrap gap-2">
                {quickRejectReasons.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => {
                      setNotes(reason);
                      setShowDenialDialog(true);
                    }}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                             rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Admin Notes
              </label>
              <button
                onClick={() => setShowNotesInput(!showNotesInput)}
                className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
              >
                {showNotesInput ? 'Hide' : 'Add Notes'}
              </button>
            </div>
            
            {(showNotesInput || notes) && (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your review notes here..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none
                         placeholder-gray-500 dark:placeholder-gray-400"
                rows={3}
              />
            )}

            {submission.adminNotes && submission.adminNotes !== notes && (
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Previous notes:</strong> {submission.adminNotes}
                </p>
              </div>
            )}
          </div>

          {/* Denial reason display */}
          {submission.denialReason && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-800 dark:text-red-300">
                <strong>Denial Reason:</strong> {submission.denialReason}
              </p>
            </div>
          )}

          {/* Action buttons */}
          {submission.status === 'pending' && (
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Button
                variant="success"
                icon={Check}
                onClick={handleApprove}
                disabled={isLoading}
                fullWidth
              >
                {isLoading ? 'Processing...' : 'Approve Submission'}
              </Button>
              <Button
                variant="danger"
                icon={X}
                onClick={handleDenyClick}
                disabled={isLoading}
                fullWidth
              >
                {isLoading ? 'Processing...' : 'Deny Submission'}
              </Button>
            </div>
          )}

          {submission.status !== 'pending' && (
            <div className="text-center py-4">
              <p className="text-gray-600 dark:text-gray-400">
                This submission has been {submission.status}.
              </p>
              {submission.reviewedAt && (
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Reviewed on {formatPhilippineDate(submission.reviewedAt, { shortFormat: true })}
                </p>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Denial Dialog */}
      <DenialDialog
        isOpen={showDenialDialog}
        onClose={() => setShowDenialDialog(false)}
        onConfirm={handleDenyConfirm}
        isLoading={isLoading}
        submissionUserName={submission.userDetails?.fullName || 'this submission'}
      />
    </>
  );
};