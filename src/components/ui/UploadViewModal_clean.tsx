import React, { useState } from 'react';
import { X, FileImage, Calendar, User, HardDrive, Check, XIcon, Undo2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { MobileUpload } from '../../types';
import { useMobileUploadsStore } from '../../stores/mobileUploads';
import { MobileUploadDenialDialog } from './MobileUploadDenialDialog';

interface UploadViewModalProps {
  upload: MobileUpload | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UploadViewModal: React.FC<UploadViewModalProps> = ({ 
  upload, 
  isOpen, 
  onClose 
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDenialDialogOpen, setIsDenialDialogOpen] = useState(false);
  const { updateUploadStatus, undoStatusChange, recentActions } = useMobileUploadsStore();

  if (!isOpen || !upload) return null;

  const handleUndo = async () => {
    if (!upload || isUpdating) return;
    
    setIsUpdating(true);
    try {
      await undoStatusChange(upload.id.toString());
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('❌ Failed to undo action:', error);
      alert('Failed to undo action. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeny = () => {
    if (upload.status !== 'pending') return;
    setIsDenialDialogOpen(true);
  };

  const handleDenialConfirm = async (reason: string) => {
    setIsUpdating(true);
    try {
      await updateUploadStatus(upload.id, 'denied', reason);
      setIsDenialDialogOpen(false);
      onClose();
    } catch (error) {
      console.error('Error denying upload:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleApprove = async () => {
    if (!upload || isUpdating || upload.status !== 'pending') return;
    
    setIsUpdating(true);
    try {
      await updateUploadStatus(upload.id, 'approved');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('❌ Failed to approve upload:', error);
      alert('Failed to approve upload. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Check if upload is already reviewed
  const isReviewed = upload?.status === 'approved' || upload?.status === 'denied';

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-lg w-full my-4 flex flex-col max-h-[calc(100vh-2rem)]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
              <FileImage className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                Upload Details
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                {upload.file_name || 'Unnamed file'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="p-2 h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 min-h-0">
          {/* Status */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status:</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit ${
              upload.status === 'approved' 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                : upload.status === 'denied'
                ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
            }`}>
              {upload.status === 'approved' ? 'Approved' : upload.status === 'denied' ? 'Denied' : 'Pending Review'}
            </span>
          </div>

          {/* User Information */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">User Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Full Name</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {upload.userDetails?.fullName || 'Unknown'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {upload.userDetails?.email || 'No email provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* File Information */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">File Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Uploaded</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {upload.created_at ? new Date(upload.created_at).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Unknown'}
                  </p>
                </div>
              </div>
              {upload.file_size && (
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">File Size</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {(upload.file_size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Denial Reason */}
          {upload.status === 'denied' && upload.comments && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-red-900 dark:text-red-300 mb-2">Denial Reason</h3>
              <p className="text-sm text-red-800 dark:text-red-200">
                {upload.comments}
              </p>
            </div>
          )}

          {/* Review Status Message */}
          {upload.status !== 'pending' && (
            <div className={`rounded-lg p-4 flex items-center gap-3 ${
              upload.status === 'approved' 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}>
              {upload.status === 'approved' ? (
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              ) : (
                <XIcon className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              )}
              <div>
                <p className={`text-sm font-medium ${
                  upload.status === 'approved' 
                    ? 'text-green-900 dark:text-green-300'
                    : 'text-red-900 dark:text-red-300'
                }`}>
                  This upload has been {upload.status === 'approved' ? 'approved' : 'denied'}
                </p>
                {upload.updated_at && (
                  <p className={`text-xs ${
                    upload.status === 'approved' 
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-red-700 dark:text-red-400'
                  }`}>
                    Reviewed on {new Date(upload.updated_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl sm:rounded-b-2xl">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {!isReviewed ? (
              <>
                {/* Show Approve/Deny buttons for pending uploads */}
                <Button
                  variant="primary"
                  size="sm"
                  icon={Check}
                  onClick={handleApprove}
                  disabled={isUpdating}
                  className="flex-1 text-sm px-3 py-2"
                >
                  {isUpdating ? 'Updating...' : 'Approve'}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  icon={XIcon}
                  onClick={handleDeny}
                  disabled={isUpdating}
                  className="flex-1 text-sm px-3 py-2"
                >
                  {isUpdating ? 'Updating...' : 'Deny'}
                </Button>
              </>
            ) : (
              /* Show Undo button for reviewed uploads (approved/denied) */
              <Button
                variant="outline"
                size="sm"
                icon={Undo2}
                onClick={handleUndo}
                disabled={isUpdating}
                className="flex-1 text-sm px-3 py-2 border-yellow-300 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
              >
                {isUpdating ? 'Undoing...' : 'Undo Review'}
              </Button>
            )}

            {/* Close Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isUpdating}
              className="flex-1 sm:flex-none sm:min-w-[80px] text-sm px-3 py-2"
            >
              Close
            </Button>
          </div>
        </div>

        {/* Denial Dialog */}
        <MobileUploadDenialDialog
          isOpen={isDenialDialogOpen}
          onClose={() => setIsDenialDialogOpen(false)}
          onConfirm={handleDenialConfirm}
          uploadFileName={upload.file_name}
          isLoading={isUpdating}
        />
      </div>
    </div>
  );
};