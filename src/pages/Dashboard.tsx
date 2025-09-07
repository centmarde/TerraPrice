import React, { useEffect } from 'react';
import { FileImage, Users, TrendingUp, Clock } from 'lucide-react';
import { useFloorplanStore } from '../stores/floorplanStore';
import { useMobileUploadsStore } from '../stores/mobileUploads';
import { MobileUploadsSection } from '../components/dashboard/MobileUploadsSection';

const Dashboard: React.FC = () => {
  const { submissions, fetchSubmissions } = useFloorplanStore();
  const { uploads, isLoading: uploadsLoading, fetchUploads } = useMobileUploadsStore();

  useEffect(() => {
    fetchSubmissions();
    fetchUploads();
  }, [fetchSubmissions, fetchUploads]);

  // Calculate statistics (will work with real data when connected to Supabase)
  const stats = {
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
    total: submissions.length
  };

  // Add some sample uploads with image URLs for testing if no real data exists
  const sampleUploads = uploads.length === 0 ? [
    {
      id: 1,
      user_id: 'sample-user-1',
      created_at: new Date().toISOString(),
      file_name: 'floorplan-sample-1.jpg',
      file_path: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRkZGIiBzdHJva2U9IiNFNUU3RUIiLz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxMCIgeT0iMTAiPgo8cGF0aCBkPSJNMjEgMTUtMy4wODYtMy4wODZhMiAyIDAgMCAwLTIuODI4IDBMNiAyMSIgc3Ryb2tlPSIjMzc0MTUxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8Y2lyY2xlIGN4PSI5IiBjeT0iOSIgcj0iMiIgc3Ryb2tlPSIjMzc0MTUxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiByeT0iMiIgc3Ryb2tlPSIjMzc0MTUxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4KPC9zdmc+',
      file_size: 2048000,
      status: 'uploaded' as const,
      updated_at: new Date().toISOString(),
      userDetails: {
        id: 'sample-user-1',
        email: 'john.doe@example.com',
        fullName: 'John Doe',
        phoneNumber: '+1234567890'
      }
    },
    {
      id: 2,
      user_id: 'sample-user-2',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      file_name: 'house-blueprint.png',
      file_path: 'https://picsum.photos/400/300?random=1',
      file_size: 1536000,
      status: 'completed' as const,
      updated_at: new Date().toISOString(),
      userDetails: {
        id: 'sample-user-2',
        email: 'jane.smith@example.com',
        fullName: 'Jane Smith',
        phoneNumber: '+0987654321'
      }
    },
    {
      id: 3,
      user_id: 'sample-user-3',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      file_name: 'architectural-plan.jpg',
      file_path: 'https://picsum.photos/400/300?random=2',
      file_size: 3072000,
      status: 'processing' as const,
      updated_at: new Date().toISOString(),
      userDetails: {
        id: 'sample-user-3',
        email: 'mike.wilson@example.com',
        fullName: 'Mike Wilson'
      }
    }
  ] : uploads;

  console.log('Dashboard Debug:', {
    realUploadsCount: uploads.length,
    sampleUploadsCount: sampleUploads.length,
    usingSampleData: uploads.length === 0,
    sampleUploads: sampleUploads
  });

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-200">Dashboard</h1>
        <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 transition-colors duration-200">
          Overview of floorplan submissions and review status
        </p>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Pending Review */}
        <div className="bg-gray-800 border-2 border-yellow-500 rounded-xl p-4 lg:p-6">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs lg:text-sm font-medium text-yellow-400">Pending Review</p>
              <p className="text-2xl lg:text-3xl font-bold text-white">{stats.pending}</p>
            </div>
          </div>
        </div>

        {/* Approved */}
        <div className="bg-gray-800 border-2 border-green-500 rounded-xl p-4 lg:p-6">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-green-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs lg:text-sm font-medium text-green-400">Approved</p>
              <p className="text-2xl lg:text-3xl font-bold text-white">{stats.approved}</p>
            </div>
          </div>
        </div>

        {/* Denied */}
        <div className="bg-gray-800 border-2 border-red-500 rounded-xl p-4 lg:p-6">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileImage className="w-4 h-4 lg:w-5 lg:h-5 text-red-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs lg:text-sm font-medium text-red-400">Denied</p>
              <p className="text-2xl lg:text-3xl font-bold text-white">{stats.rejected}</p>
            </div>
          </div>
        </div>

        {/* Total Reviewed */}
        <div className="bg-gray-800 border-2 border-blue-500 rounded-xl p-4 lg:p-6">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs lg:text-sm font-medium text-blue-400">Total Reviewed</p>
              <p className="text-2xl lg:text-3xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Uploads Section */}
      <MobileUploadsSection 
        uploads={sampleUploads} 
        isLoading={uploadsLoading}
      />
    </div>
  );
};

export default Dashboard;