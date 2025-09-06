import React, { useState } from 'react';
import { 
  Upload, 
  FileImage, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  Search,
  Calendar,
  User,
  MoreVertical
} from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';

interface MobileUpload {
  id: number;
  file_name: string | null;
  file_size: number | null;
  status: string | null;
  created_at: string | null;
  userDetails?: {
    fullName?: string;
    email?: string;
  };
}

interface MobileUploadsProps {
  uploads: MobileUpload[];
  isLoading: boolean;
}

const ITEMS_PER_PAGE = 5;

export const MobileUploadsSection: React.FC<MobileUploadsProps> = ({ 
  uploads, 
  isLoading 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter uploads based on search and status
  const filteredUploads = uploads.filter(upload => {
    const matchesSearch = !searchTerm || 
      (upload.file_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (upload.userDetails?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (upload.userDetails?.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || upload.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredUploads.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUploads = filteredUploads.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    const kb = Math.round(bytes / 1024);
    return kb < 1024 ? `${kb} KB` : `${(kb / 1024).toFixed(1)} MB`;
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300';
      case 'approved': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
      case 'denied': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'denied', label: 'Denied' }
  ];

  return (
    <Card>
      <CardHeader 
        title="Recent Mobile Uploads"
        subtitle={`${filteredUploads.length} total uploads${statusFilter !== 'all' ? ` (${statusFilter})` : ''}`}
        action={
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredUploads.length} uploads
            </span>
            <Upload className="w-4 h-4 text-gray-400" />
          </div>
        }
      />

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search uploads, files, or users..."
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700 dark:border-teal-400"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Loading uploads...</span>
        </div>
      ) : filteredUploads.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No matching uploads' : 'No recent uploads'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search terms or filters'
              : 'Mobile uploads from users will appear here'
            }
          </p>
        </div>
      ) : (
        <>
          {/* Upload Cards */}
          <div className="space-y-3">
            {paginatedUploads.map((upload) => (
              <div 
                key={upload.id}
                className="group p-4 border border-gray-200 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700/50 hover:shadow-md hover:border-teal-300 dark:hover:border-teal-600
                         transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  {/* File Info */}
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileImage className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {upload.file_name || 'Unknown File'}
                        </p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(upload.status)}`}>
                          {upload.status || 'unknown'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(upload.created_at)}
                        </span>
                        <span>{formatFileSize(upload.file_size)}</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {upload.userDetails?.fullName || upload.userDetails?.email || 'Unknown User'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Menu */}
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredUploads.length)} of {filteredUploads.length} uploads
              </p>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  icon={ChevronLeft}
                >
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        pageNum === currentPage
                          ? 'bg-teal-700 text-white dark:bg-teal-600'
                          : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  icon={ChevronRight}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
};
