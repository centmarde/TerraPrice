import React, { useState, useEffect } from 'react';
import { 
  History as HistoryIcon,
  FileImage, 
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useFloorplanStore } from '../stores/floorplanStore';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingDots } from '../components/ui/Loader';

const ITEMS_PER_PAGE = 8;

const ReviewHistory: React.FC = () => {
  const { submissions, fetchSubmissions, isLoading } = useFloorplanStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Filter only approved and denied submissions
  const reviewedSubmissions = submissions.filter(submission => 
    submission.status === 'approved' || submission.status === 'rejected'
  );

  // Apply search and status filters
  const filteredSubmissions = reviewedSubmissions.filter(submission => {
    const matchesSearch = !searchTerm || 
      (submission.userDetails?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (submission.userDetails?.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (submission.location?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort by reviewed date (most recent first)
  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    const dateA = a.reviewedAt ? new Date(a.reviewedAt).getTime() : 0;
    const dateB = b.reviewedAt ? new Date(b.reviewedAt).getTime() : 0;
    return dateB - dateA;
  });

  // Pagination
  const totalPages = Math.ceil(sortedSubmissions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSubmissions = sortedSubmissions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatDate = (dateString: Date | string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
    { value: 'rejected', label: 'Denied' }
  ];

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

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-800 dark:text-green-300">Approved</span>
            </div>
            <p className="text-2xl font-bold text-green-900 dark:text-green-200 mt-1">
              {reviewedSubmissions.filter(s => s.status === 'approved').length}
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-800 dark:text-red-300">Denied</span>
            </div>
            <p className="text-2xl font-bold text-red-900 dark:text-red-200 mt-1">
              {reviewedSubmissions.filter(s => s.status === 'rejected').length}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <HistoryIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-300">Total Reviewed</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {reviewedSubmissions.length}
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
            {/* History Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {paginatedSubmissions.map((submission) => (
                <div 
                  key={submission.id}
                  className="group p-4 border border-gray-200 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700/50 hover:shadow-md hover:border-teal-300 dark:hover:border-teal-600
                           transition-all duration-200"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                        <FileImage className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {submission.userDetails?.fullName || 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {submission.userDetails?.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusIcon(submission.status)}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                        {submission.status === 'approved' ? 'Approved' : 'Denied'}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Estimated Cost:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(submission.estimatedCost)}
                      </span>
                    </div>
                    
                    {submission.squareFootage && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Square Footage:</span>
                        <span className="text-gray-900 dark:text-white">
                          {submission.squareFootage.toLocaleString()} sq ft
                        </span>
                      </div>
                    )}

                    {submission.location && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Location:</span>
                        <span className="text-gray-900 dark:text-white">
                          {submission.location}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Reviewed:</span>
                      <span className="text-gray-900 dark:text-white">
                        {submission.reviewedAt ? formatDate(submission.reviewedAt) : 'Unknown'}
                      </span>
                    </div>
                  </div>

                  {/* Admin Notes */}
                  {submission.adminNotes && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-600/50 rounded-lg">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Admin Notes:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {submission.adminNotes}
                      </p>
                    </div>
                  )}

                  {/* View Button */}
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Eye}
                      className="w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, sortedSubmissions.length)} of {sortedSubmissions.length} reviews
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
    </div>
  );
};

export default ReviewHistory;
