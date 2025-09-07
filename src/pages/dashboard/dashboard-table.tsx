import React, { useEffect } from 'react';
import { FileText, Calendar, User, HardDrive, Eye, Download } from 'lucide-react';
import { useMobileUploadsStore } from '../../stores/mobileUploads';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingBars } from '../../components/ui/Loader';
import { MobileUpload } from '../../types';

const DashboardTable: React.FC = () => {
  const { uploads, isLoading, fetchUploads, selectUpload } = useMobileUploadsStore();

  useEffect(() => {
    fetchUploads();
  }, [fetchUploads]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-100 text-blue-800';
      case 'uploaded':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewUpload = (upload: MobileUpload) => {
    selectUpload(upload.id);
    // Here you could navigate to a detailed view or open a modal
    console.log('Viewing upload:', upload);
  };

  const handleDownloadUpload = (upload: MobileUpload) => {
    // Implement download functionality
    console.log('Downloading upload:', upload);
  };

  return (
    <Card>
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
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">File</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Size</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Uploaded</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Updated</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {uploads.map((upload) => (
                <tr key={upload.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 truncate max-w-[200px]" title={upload.file_name}>
                          {upload.file_name}
                        </p>
                        <p className="text-sm text-gray-500">ID: {upload.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900 font-medium">
                          {upload.userDetails?.fullName || 'Anonymous'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {upload.userDetails?.email || 'No email'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <HardDrive className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {formatFileSize(upload.file_size)}
                      </span>
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
                      <span className="text-sm text-gray-600">
                        {formatDate(upload.created_at)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
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
      )}
    </Card>
  );
};

export default DashboardTable;
