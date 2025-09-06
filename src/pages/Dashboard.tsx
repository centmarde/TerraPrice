import React, { useEffect } from 'react';
import { FileImage, Users, TrendingUp, Clock } from 'lucide-react';
import { useFloorplanStore } from '../stores/floorplanStore';
import { useMobileUploadsStore } from '../stores/mobileUploads';
import { Card } from '../components/ui/Card';
import { MobileUploadsSection } from '../components/dashboard/MobileUploadsSection';
import DashboardTable from './dashboard/dashboard-table';

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

  // Filter uploads from the last 24 hours for recent uploads
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  
  const recentMobileUploads = uploads
    .filter(upload => {
      if (!upload.created_at) return false;
      const uploadDate = new Date(upload.created_at);
      return uploadDate >= oneDayAgo;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB.getTime() - dateA.getTime();
    });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-200">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 transition-colors duration-200">
          Overview of floorplan submissions and review status
        </p>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-200">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">{stats.pending}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-200">Approved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">{stats.approved}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <FileImage className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-200">Rejected</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">{stats.rejected}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-teal-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-200">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">{stats.total}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Enhanced Mobile Uploads Section */}
      <MobileUploadsSection 
        uploads={recentMobileUploads} 
        isLoading={uploadsLoading}
      />

      {/* Mobile Uploads Table */}
      <DashboardTable />
    </div>
  );
};

export default Dashboard;