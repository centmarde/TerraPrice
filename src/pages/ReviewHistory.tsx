import React, { useState, useEffect } from 'react';
import { 
  History as HistoryIcon,
  FileImage, 
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useMobileUploadsStore } from '../stores/mobileUploads';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingDots } from '../components/ui/Loader';
import { UploadViewModal } from '../components/ui/UploadViewModal';
import { MobileUpload } from '../types';
import { formatPhilippineDate } from '../utils/dateUtils';

const ITEMS_PER_PAGE = 4;

const ReviewHistory: React.FC = () => {
  const { uploads, fetchUploads, isLoading } = useMobileUploadsStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUpload, setSelectedUpload] = useState<MobileUpload | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUploads();
  }, [fetchUploads]);

  const handleViewDetails = (upload: MobileUpload) => {
    setSelectedUpload(upload);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUpload(null);
  };

  useEffect(() => {
    fetchUploads();
  }, [fetchUploads]);

  // Filter only approved and denied submissions
  const reviewedSubmissions = (uploads || []).filter(upload => 
    upload.status === 'approved' || upload.status === 'denied'
  );

  // Apply search and status filters
  const filteredSubmissions = reviewedSubmissions.filter(upload => {
    const searchLower = searchTerm?.toLowerCase() || '';
    const matchesSearch = !searchTerm || 
      (upload.userDetails?.fullName?.toLowerCase().includes(searchLower)) ||
      (upload.userDetails?.email?.toLowerCase().includes(searchLower)) ||
      (upload.file_name?.toLowerCase().includes(searchLower));
    
    const matchesStatus = statusFilter === 'all' || upload.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort by reviewed date (most recent first)
  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
    const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
    return dateB - dateA;
  });

  // Pagination
  const totalPages = Math.ceil(sortedSubmissions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSubmissions = sortedSubmissions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatDate = (dateString: Date | string) => {
    return formatPhilippineDate(dateString);
  };

  const getStatusIcon = (status: string) => {
    return status === 'approved' ? 
      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" /> :
      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
  };

  const getStatusColor = (status: string) => {
    return status === 'approved' ? 
      'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' :
      'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300';
  };

  const statusOptions = [
    { value: 'all', label: 'All Reviews' },
    { value: 'approved', label: 'Approved' },
    { value: 'denied', label: 'Denied' }
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Early return if data is not ready
  if (!Array.isArray(uploads)) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingDots size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
            <HistoryIcon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
              Review History
            </h1>
            <p className="text-gray-600 dark:text-gray-300 transition-colors duration-200">
              View all approved and denied floorplan submissions
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user, location, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-teal-500 focus:border-transparent
                       placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors duration-200"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingDots size="lg" text="Loading history..." />
          </div>
        ) : sortedSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <HistoryIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No matching reviews' : 'No review history'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search terms or filters'
                : 'Approved and denied submissions will appear here'
              }
            </p>
          </div>
        ) : (
          <>
            {/* History Cards - 4 per page */}
            {paginatedSubmissions.length > 0 ? (
              <div className="space-y-3">
                {paginatedSubmissions.map((upload) => {
                  return (
                    <div 
                      key={upload.id}
                      className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg
                               hover:shadow-md hover:border-teal-300 dark:hover:border-teal-600
                               transition-all duration-200 overflow-hidden"
                    >
                      <div className="p-4">
                        {/* Header Section */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                              <FileImage className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                            </div>
                            <div>
                              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                {upload.userDetails?.fullName || 'Unknown User'}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {upload.userDetails?.email || 'No email provided'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {getStatusIcon(upload.status)}
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(upload.status)}`}>
                              {upload.status === 'approved' ? 'Approved' : 'Denied'}
                            </span>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-3">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">File Name</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {upload.file_name}
                            </p>
                          </div>
                          
                          {upload.file_size !== null && upload.file_size !== undefined && (
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-3">
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">File Size</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatFileSize(upload.file_size)}
                              </p>
                            </div>
                          )}

                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-3">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Reviewed</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {upload.updated_at ? formatDate(upload.updated_at) : 'Unknown'}
                            </p>
                          </div>
                        </div>

                        {/* Denial Reason for denied uploads */}
                        {upload.status === 'denied' && upload.comments && (
                          <div className="mt-3 mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                            <p className="text-xs font-medium text-red-700 dark:text-red-300 mb-1">Denial Reason:</p>
                            <p className="text-sm text-red-800 dark:text-red-200">
                              {upload.comments}
                            </p>
                          </div>
                        )}

                        {/* Action Button */}
                        <div className={`flex justify-end ${upload.status === 'denied' && upload.comments ? 'mt-6' : 'mt-4'}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Eye}
                            onClick={() => handleViewDetails(upload)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* No more uploads message */
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HistoryIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No more uploads
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  You've reached the end of the review history
                </p>
              </div>
            )}

            {/* Pagination - Always show if there are any submissions */}
            {sortedSubmissions.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Page {currentPage} of {Math.max(1, totalPages)} ({sortedSubmissions.length} total reviews)
                  </p>
                  
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      icon={ChevronLeft}
                    >
                      Previous
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={false} // Never disable - let them see "no more uploads"
                      icon={ChevronRight}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Upload View Modal */}
      <UploadViewModal
        upload={selectedUpload}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ReviewHistory;
