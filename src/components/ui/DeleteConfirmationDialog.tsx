import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';
import { Portal } from './Portal';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  uploadFileName: string;
  isLoading?: boolean;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  uploadFileName,
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border-2 border-red-200 dark:border-red-800">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Confirm Deletion
                </h3>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="p-2 h-9 w-9"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900 dark:text-red-300 mb-2">
                  This action cannot be undone!
                </p>
                <p className="text-sm text-red-800 dark:text-red-200">
                  You are about to permanently delete this upload from the entire system, including:
                </p>
                <ul className="mt-2 ml-4 space-y-1 text-sm text-red-800 dark:text-red-200 list-disc">
                  <li>The uploaded file from storage</li>
                  <li>All metadata and information</li>
                  <li>Review history and comments</li>
                  <li>All associated data from the database</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                File to be deleted:
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white break-all">
                {uploadFileName}
              </p>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Are you absolutely sure you want to proceed with this deletion?
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-2xl">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={onConfirm}
              disabled={isLoading}
              icon={Trash2}
              className="flex-1"
            >
              {isLoading ? 'Deleting...' : 'Delete Permanently'}
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  );
};
