import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface DenialDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
  submissionUserName?: string;
}

export const DenialDialog: React.FC<DenialDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  submissionUserName = 'this submission'
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const predefinedReasons = [
    'Incomplete floorplan - missing essential details',
    'Poor image quality - unable to read dimensions',
    'Missing or unclear dimensions',
    'Invalid file format or corrupted image',
    'Floorplan does not meet minimum requirements',
    'Duplicate submission detected',
    'Insufficient information for accurate cost estimation'
  ];

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
    setIsCustom(false);
    setCustomReason('');
  };

  const handleCustomReasonSelect = () => {
    setIsCustom(true);
    setSelectedReason('');
  };

  const handleConfirm = () => {
    const finalReason = isCustom ? customReason.trim() : selectedReason;
    if (finalReason) {
      onConfirm(finalReason);
      // Reset form
      setSelectedReason('');
      setCustomReason('');
      setIsCustom(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setSelectedReason('');
    setCustomReason('');
    setIsCustom(false);
  };

  const isFormValid = isCustom ? customReason.trim().length > 0 : selectedReason.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Deny Submission
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-words">
                  Please provide a reason for denying {submissionUserName}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select a reason for denial:
              </label>
              
              {/* Predefined reasons */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {predefinedReasons.map((reason, index) => (
                  <label key={index} className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="denialReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => handleReasonSelect(reason)}
                      className="mt-1 text-red-600 focus:ring-red-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {reason}
                    </span>
                  </label>
                ))}
                
                {/* Custom reason option */}
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="denialReason"
                    checked={isCustom}
                    onChange={handleCustomReasonSelect}
                    className="mt-1 text-red-600 focus:ring-red-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Other (specify below)
                  </span>
                </label>
              </div>
            </div>

            {/* Custom reason input */}
            {isCustom && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom reason:
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Please provide a detailed reason for denial..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-red-500 focus:border-red-500
                           placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                  rows={3}
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Minimum 10 characters required for custom reason
                </p>
              </div>
            )}

            {/* Warning message */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <div className="flex">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                    This action will notify the user
                  </h4>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                    The user will receive an email with the denial reason. This action can be undone within 5 minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-600">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirm}
              disabled={!isFormValid || isLoading || (isCustom && customReason.trim().length < 10)}
              className="order-1 sm:order-2"
            >
              {isLoading ? 'Processing...' : 'Deny Submission'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};