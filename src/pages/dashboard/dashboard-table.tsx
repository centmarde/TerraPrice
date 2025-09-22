import React, { useEffect } from 'react';
import { FileText, Calendar, User, HardDrive, Eye, Download, Brain } from 'lucide-react';
import { useMobileUploadsStore } from '../../stores/mobileUploads';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingBars } from '../../components/ui/Loader';
import { MobileUpload } from '../../types';
import DashboardDialog from './dashboard-dialog';
import { getDisplayConfidenceScore, getConfidenceBadgeColor, getConfidenceLevelText } from '../../utils/confidenceUtils';
import { formatPhilippineDate } from '../../utils/dateUtils';

const DashboardTable: React.FC = () => {
  const { 
    uploads, 
    isLoading, 
    fetchUploads, 
    openDialog, 
    closeDialog, 
    isDialogOpen, 
    selectedUpload 
  } = useMobileUploadsStore();

  useEffect(() => {
    fetchUploads();
  }, [fetchUploads]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return formatPhilippineDate(dateString);
  };

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getConfidenceScoreColor = (score?: number | null) => {
    if (score === null || score === undefined) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
  };

  const getConfidenceScoreLabel = (score?: number | null) => {
    if (score === null || score === undefined) return 'N/A';
    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium';
    return 'Low';
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

  const handleViewUpload = (upload: MobileUpload) => {
    openDialog(upload);
  };

  const handleDownloadUpload = (upload: MobileUpload) => {
    // Implement download functionality
    console.log('Downloading upload:', upload);
  };

  return (
    <>
    {/* Dialog */}
      {isDialogOpen && selectedUpload && (
        <DashboardDialog
          isOpen={isDialogOpen}
          upload={selectedUpload}
          onClose={closeDialog}
        />
      )}
      <Card >
        <CardHeader 
          title="Mobile Uploads"
          subtitle="Recent file uploads from mobile app"
          action={
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Total: {uploads.length}
              </span>
            </div>
          }
        />
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingBars size="lg" text="Loading uploads..." />
        </div>
      ) : uploads.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">No mobile uploads yet</p>
          <p className="text-sm text-gray-400">
            Uploads from the mobile app will appear here
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">File</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Size</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">AI Score</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Uploaded</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Updated</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {uploads.map((upload) => (
                  <tr key={upload.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/50 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[200px]" title={upload.file_name}>
                            {upload.file_name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">ID: {upload.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                            {upload.userDetails?.fullName || 'Anonymous'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {upload.userDetails?.email || 'No email'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <HardDrive className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {formatFileSize(upload.file_size)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Brain className="w-4 h-4 text-gray-400" />
                        {upload.confidence_score !== null && upload.confidence_score !== undefined ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {getDisplayConfidenceScore(upload.confidence_score)}%
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getConfidenceBadgeColor(getDisplayConfidenceScore(upload.confidence_score))}`}>
                              {getConfidenceLevelText(getDisplayConfidenceScore(upload.confidence_score))}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">N/A</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(upload.status)}`}>
                        {upload.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {formatDate(upload.created_at)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {formatDate(upload.updated_at)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          icon={Eye}
                          onClick={() => handleViewUpload(upload)}
                          className="text-xs"
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          icon={Download}
                          onClick={() => handleDownloadUpload(upload)}
                          className="text-xs"
                        >
                          Download
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {uploads.map((upload) => (
              <div key={upload.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                {/* Header with file info */}
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate text-sm" title={upload.file_name}>
                      {upload.file_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ID: {upload.id}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(upload.status)}`}>
                        {upload.status}
                      </span>
                      <div className="flex items-center space-x-2">
                        {upload.confidence_score !== null && upload.confidence_score !== undefined && (
                          <div className="flex items-center space-x-1">
                            <Brain className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                              {getDisplayConfidenceScore(upload.confidence_score)}%
                            </span>
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getConfidenceBadgeColor(getDisplayConfidenceScore(upload.confidence_score))}`}>
                              {getConfidenceLevelText(getDisplayConfidenceScore(upload.confidence_score))}
                            </span>
                          </div>
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(upload.file_size)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User info */}
                <div className="flex items-center space-x-2 text-sm">
                  <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-gray-900 dark:text-gray-100 font-medium truncate">
                      {upload.userDetails?.fullName || 'Anonymous'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {upload.userDetails?.email || 'No email'}
                    </span>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-gray-500 dark:text-gray-400">Uploaded</p>
                      <p className="text-gray-700 dark:text-gray-300 truncate">{formatDate(upload.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-gray-500 dark:text-gray-400">Updated</p>
                      <p className="text-gray-700 dark:text-gray-300 truncate">{formatDate(upload.updated_at)}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <Button
                    size="sm"
                    variant="outline"
                    icon={Eye}
                    onClick={() => handleViewUpload(upload)}
                    className="flex-1 text-xs touch-manipulation"
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    icon={Download}
                    onClick={() => handleDownloadUpload(upload)}
                    className="flex-1 text-xs touch-manipulation"
                  >
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </Card>

      
    </>
  );
};

export default DashboardTable;
