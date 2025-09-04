import React, { useEffect } from 'react';
import { FileImage, Users, TrendingUp, Clock, Upload } from 'lucide-react';
import { useFloorplanStore } from '../stores/floorplanStore';
import { useMobileUploadsStore } from '../stores/mobileUploads';
import { Card, CardHeader } from '../components/ui/Card';
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
    denied: submissions.filter(s => s.status === 'denied').length,
    total: submissions.length
  };

  // Filter uploads from the last 24 hours
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
    })
    .slice(0, 5);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div  className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Overview of floorplan submissions and review status
        </p>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
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
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
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
              <p className="text-sm font-medium text-gray-600">Denied</p>
              <p className="text-2xl font-bold text-gray-900">{stats.denied}</p>
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
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Mobile Uploads */}
      <Card>
        <CardHeader 
          title="Recent Mobile Uploads"
          subtitle="Mobile uploads from the last 24 hours"
          action={
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {recentMobileUploads.length} recent
              </span>
              <Upload className="w-4 h-4 text-gray-400" />
            </div>
          }
        />
        
        {uploadsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
            <span className="ml-3 text-gray-600">Loading uploads...</span>
          </div>
        ) : recentMobileUploads.length === 0 ? (
          <div className="text-center py-8">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No recent uploads</p>
            <p className="text-sm text-gray-400">
              Mobile uploads from the last 24 hours will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentMobileUploads.map((upload) => (
              <div 
                key={upload.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <FileImage className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {upload.file_name || 'Unknown File'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {upload.file_size ? `${Math.round(upload.file_size / 1024)} KB` : 'Size unknown'} • 
                      {formatDate(upload.created_at)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      upload.status === 'approved' ? 'bg-green-100 text-green-800' :
                      upload.status === 'denied' ? 'bg-red-100 text-red-800' :
                      upload.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      upload.status === 'uploading' ? 'bg-blue-100 text-blue-800' :
                      upload.status === 'uploaded' ? 'bg-emerald-100 text-emerald-800' :
                      upload.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                      upload.status === 'completed' ? 'bg-teal-100 text-teal-800' :
                      upload.status === 'error' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {upload.status || 'unknown'}
                  </span>
                  <div className="text-sm text-gray-500">
                    User: {upload.userDetails?.fullName || upload.userDetails?.email || 'Unknown'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Mobile Uploads Table */}
      <div className="mt-8">
        <DashboardTable />
      </div>
      
    </div>
  );
};

export default Dashboard;