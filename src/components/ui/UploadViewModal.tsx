import React, { useState } from 'react';
import { X, FileImage, Calendar, User, HardDrive, Check, XIcon, Undo2, Brain } from 'lucide-react';
import { Button } from './Button';
import { MobileUpload } from '../../types';
import { useMobileUploadsStore } from '../../stores/mobileUploads';
import { MobileUploadDenialDialog } from './MobileUploadDenialDialog';
import { supabase } from '../../lib/supabase';
import { getDisplayConfidenceScore, getConfidenceTextColor, getConfidenceBadgeColor, getConfidenceLevelText } from '../../utils/confidenceUtils';
import { formatPhilippineDate } from '../../utils/dateUtils';
import { Portal } from './Portal';

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

  // Helper function to get public URL for uploaded files
  const getImageUrl = (filePath: string) => {
    if (!filePath) return null;
    
    // If the file path is already a full URL, return it as is
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }
    
    // Get public URL from Supabase storage
    const { data } = supabase.storage
      .from('mobile-uploads')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  };

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
    if (upload.status === 'approved' || upload.status === 'denied') return;
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
    if (!upload || isUpdating || upload.status === 'approved' || upload.status === 'denied') return;
    
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

  if (!isOpen || !upload) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl lg:max-w-3xl w-full my-4 flex flex-col max-h-[calc(100vh-3rem)]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
              <FileImage className="w-6 h-6 sm:w-7 sm:h-7 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white truncate">
                Upload Details
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 truncate mt-1">
                {upload.file_name || 'Unnamed file'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="p-3 h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 sm:space-y-8 min-h-0">
          {/* Status */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <span className="text-base font-medium text-gray-600 dark:text-gray-400">Status:</span>
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm sm:text-base font-medium w-fit ${
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
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Full Name</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white truncate">
                    {upload.userDetails?.fullName || 'Unknown'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white truncate">
                    {upload.userDetails?.email || 'No email provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* File Information */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">File Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Uploaded</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {upload.created_at ? formatPhilippineDate(upload.created_at) : 'Unknown'}
                  </p>
                </div>
              </div>
              {upload.file_size !== null && upload.file_size !== undefined && (
                <div className="flex items-center gap-3">
                  <HardDrive className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">File Size</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {(upload.file_size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}
              {upload.confidence_score !== null && upload.confidence_score !== undefined && (
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">AI Confidence Score</p>
                    <div className="flex items-center gap-2">
                      <p className={`text-base font-medium ${getConfidenceTextColor(getDisplayConfidenceScore(upload.confidence_score))}`}>
                        {getDisplayConfidenceScore(upload.confidence_score)}%
                      </p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConfidenceBadgeColor(getDisplayConfidenceScore(upload.confidence_score))}`}>
                        {getConfidenceLevelText(getDisplayConfidenceScore(upload.confidence_score))}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Floorplan Preview */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Floorplan Preview</h3>
            <div className="relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden">
              {upload.file_path ? (
                <div className="relative">
                  <img
                    src={getImageUrl(upload.file_path) || upload.file_path}
                    alt={`Floorplan - ${upload.file_name}`}
                    className="w-full h-auto max-h-[500px] object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                            <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p class="text-sm">Unable to load image</p>
                            <p class="text-xs text-gray-400 dark:text-gray-500">${upload.file_name}</p>
                          </div>
                        `;
                      }
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-black/70 text-white text-sm px-3 py-2 rounded-lg backdrop-blur-sm">
                    {upload.file_name}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                  <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">No image available</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{upload.file_name}</p>
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
          {(upload.status === 'approved' || upload.status === 'denied') && (
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
                    Reviewed on {formatPhilippineDate(upload.updated_at)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 p-6 sm:p-8 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl sm:rounded-b-2xl">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Show Approve/Deny buttons for all non-reviewed statuses */}
            {(upload.status !== 'approved' && upload.status !== 'denied') ? (
              <>
                {/* Show Approve/Deny buttons for pending/uploaded/processing uploads */}
                <Button
                  variant="primary"
                  size="md"
                  icon={Check}
                  onClick={handleApprove}
                  disabled={isUpdating}
                  className="flex-1 text-base px-6 py-3"
                >
                  {isUpdating ? 'Updating...' : 'Approve'}
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  icon={XIcon}
                  onClick={handleDeny}
                  disabled={isUpdating}
                  className="flex-1 text-base px-6 py-3"
                >
                  {isUpdating ? 'Updating...' : 'Deny'}
                </Button>
              </>
            ) : upload.status === 'approved' ? (
              /* Show Undo button for approved uploads */
              <Button
                variant="outline"
                size="md"
                icon={Undo2}
                onClick={handleUndo}
                disabled={isUpdating}
                className="flex-1 text-base px-6 py-3 border-yellow-300 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
              >
                {isUpdating ? 'Undoing...' : 'Undo Review'}
              </Button>
            ) : upload.status === 'denied' ? (
              /* Show Undo button for denied uploads */
              <Button
                variant="outline"
                size="md"
                icon={Undo2}
                onClick={handleUndo}
                disabled={isUpdating}
                className="flex-1 text-base px-6 py-3 border-yellow-300 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
              >
                {isUpdating ? 'Undoing...' : 'Undo Review'}
              </Button>
            ) : (
              /* Fallback for unknown statuses */
              <div className="flex-1 text-center text-base text-gray-500 dark:text-gray-400 py-3">
                Upload Status: {upload.status}
              </div>
            )}

            {/* Close Button */}
            <Button
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={isUpdating}
              className="flex-1 sm:flex-none sm:min-w-[100px] text-base px-6 py-3"
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
    </Portal>
  );
};