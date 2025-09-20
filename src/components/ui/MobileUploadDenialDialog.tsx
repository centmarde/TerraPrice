import React, { useState } from 'react';
import { X, AlertTriangle, FileX } from 'lucide-react';
import { Button } from './Button';

interface MobileUploadDenialDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  uploadFileName?: string;
  isLoading?: boolean;
}

const PREDEFINED_REASONS = [
  'Poor image quality - unable to read floorplan clearly',
  'Incomplete floorplan - missing essential details',
  'Wrong file format - not a valid floorplan',
  'Duplicate submission - already reviewed',
  'Contains inappropriate content',
  'File corruption - unable to process',
  'Insufficient documentation provided',
  'Does not meet size requirements',
  'Other (please specify below)'
];

export const MobileUploadDenialDialog: React.FC<MobileUploadDenialDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  uploadFileName,
  isLoading = false
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  console.log('🔍 Denial dialog state:', { isOpen, uploadFileName, isLoading, selectedReason, customReason });

  if (!isOpen) return null;

  const handleConfirm = () => {
    const reason = selectedReason === 'Other (please specify below)' 
      ? customReason.trim() 
      : selectedReason;
    
    if (!reason) return;
    
    onConfirm(reason);
    
    // Reset form
    setSelectedReason('');
    setCustomReason('');
  };

  const handleClose = () => {
    if (isLoading) return;
    
    // Reset form
    setSelectedReason('');
    setCustomReason('');
    onClose();
  };

  const isCustomSelected = selectedReason === 'Other (please specify below)';
  const finalReason = isCustomSelected ? customReason.trim() : selectedReason;
  const canConfirm = finalReason.length > 0 && !isLoading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <FileX className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Deny Upload
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {uploadFileName ? `File: ${uploadFileName}` : 'Please provide a reason'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 h-9 w-9"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Warning */}
          <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Professional Review Required
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Please provide a clear reason for denial to maintain transparency and help users understand the decision.
              </p>
            </div>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Select reason for denial:
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {PREDEFINED_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedReason === reason
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="denial-reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="mt-0.5 w-4 h-4 text-red-600 border-gray-300 dark:border-gray-600 focus:ring-red-500"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-gray-900 dark:text-white flex-1">
                    {reason}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Reason Input */}
          {isCustomSelected && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Please specify the reason:
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Enter detailed reason for denial..."
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-red-500 focus:border-transparent
                         placeholder-gray-500 dark:placeholder-gray-400
                         resize-none transition-colors duration-200"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {customReason.length}/500 characters
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-2xl">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="min-w-[100px]"
          >
            {isLoading ? 'Denying...' : 'Deny Upload'}
          </Button>
        </div>
      </div>
    </div>
  );
};