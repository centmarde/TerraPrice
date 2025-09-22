import React, { useState } from 'react';
import { X, FileText, User, Calendar, HardDrive, Check, XIcon, Eye } from 'lucide-react';
import { useMobileUploadsStore } from '../../stores/mobileUploads';
import { Button } from '../../components/ui/Button';
import { MobileUpload } from '../../types';
import RejectionDialog from '../../components/ui/RejectionDialog';
import { formatPhilippineDate } from '../../utils/dateUtils';

interface DashboardDialogProps {
  isOpen: boolean;
  upload: MobileUpload;
  onClose: () => void;
}

const DashboardDialog: React.FC<DashboardDialogProps> = ({ isOpen, upload, onClose }) => {
  const { updateUploadStatus } = useMobileUploadsStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDenialDialog, setShowDenialDialog] = useState(false);

  if (!isOpen) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return formatPhilippineDate(dateString);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'denied':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'uploading':
        return 'bg-blue-100 text-blue-800';
      case 'uploaded':
        return 'bg-emerald-100 text-emerald-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-teal-100 text-teal-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = async () => {
    setIsUpdating(true);
    try {
      await updateUploadStatus(upload.id, 'approved');
      onClose();
    } catch (error) {
      console.error('Error approving upload:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = () => {
    setShowDenialDialog(true);
  };

  const handleRejectConfirm = async (comment: string) => {
    setIsUpdating(true);
    try {
      await updateUploadStatus(upload.id, 'denied', comment);
      setShowDenialDialog(false);
      onClose();
    } catch (error) {
      console.error('Error denying upload:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRejectCancel = () => {
    setShowDenialDialog(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Mobile Upload Details</h2>
            <p className="text-sm text-gray-600">Review and process the uploaded file</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isUpdating}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Upload Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Information</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">File Name</p>
                      <p className="text-sm text-gray-600">{upload.file_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <HardDrive className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">File Size</p>
                      <p className="text-sm text-gray-600">{formatFileSize(upload.file_size)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Uploaded</p>
                      <p className="text-sm text-gray-600">{formatDate(upload.created_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Last Updated</p>
                      <p className="text-sm text-gray-600">{formatDate(upload.updated_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(upload.status).includes('green') ? 'bg-green-500' : 
                        getStatusColor(upload.status).includes('red') ? 'bg-red-500' : 
                        getStatusColor(upload.status).includes('yellow') ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(upload.status)}`}>
                        {upload.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Information */}
              {upload.userDetails && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">User Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Name</p>
                        <p className="text-sm text-gray-600">{upload.userDetails.fullName}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-600">{upload.userDetails.email}</p>
                      </div>
                    </div>

                    {upload.userDetails.phoneNumber && (
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Phone</p>
                          <p className="text-sm text-gray-600">{upload.userDetails.phoneNumber}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* AI Analysis Image */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">AI Analysis</h3>
              
              {upload.ai_analysis_path ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={upload.ai_analysis_path}
                    alt="AI Analysis"
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden p-8 text-center bg-gray-50">
                    <Eye className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 mb-2">Image not available</p>
                    <p className="text-sm text-gray-400">The AI analysis image could not be loaded</p>
                  </div>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg p-8 text-center bg-gray-50">
                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 mb-2">No AI analysis available</p>
                  <p className="text-sm text-gray-400">This upload has not been processed yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          {upload.comments && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Comments</h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{upload.comments}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUpdating}
          >
            Close
          </Button>
          
          {upload.status !== 'denied' && (
            <Button
              variant="outline"
              onClick={handleReject}
              disabled={isUpdating}
              icon={XIcon}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              {isUpdating ? 'Updating...' : 'Deny'}
            </Button>
          )}
          
          {upload.status !== 'approved' && upload.status !== 'denied' && (
            <Button
              onClick={handleApprove}
              disabled={isUpdating}
              icon={Check}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isUpdating ? 'Updating...' : 'Approve'}
            </Button>
          )}
        </div>
      </div>

      {/* Denial Dialog */}
      <RejectionDialog
        isOpen={showDenialDialog}
        onClose={handleRejectCancel}
        onConfirm={handleRejectConfirm}
        isLoading={isUpdating}
      />
    </div>
  );
};

export default DashboardDialog;
