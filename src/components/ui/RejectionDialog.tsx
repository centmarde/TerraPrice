import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface RejectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => void;
  isLoading?: boolean;
}

const RejectionDialog: React.FC<RejectionDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading = false 
}) => {
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(comment.trim());
  };

  const handleClose = () => {
    setComment('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Reject Upload</h2>
              <p className="text-sm text-gray-600">Provide a reason for rejection</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="rejection-comment" className="block text-sm font-medium text-gray-700 mb-2">
              Reason for rejection <span className="text-red-500">*</span>
            </label>
            <textarea
              id="rejection-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Please provide a detailed reason for rejecting this upload..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              rows={4}
              required
              disabled={isLoading}
              maxLength={500}
            />
            <div className="mt-1 text-xs text-gray-500 text-right">
              {comment.length}/500 characters
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  This action cannot be undone
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  The user will be notified about the rejection and the reason you provide.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !comment.trim()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? 'Rejecting...' : 'Reject Upload'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectionDialog;
