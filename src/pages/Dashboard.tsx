import React, { useEffect } from 'react';
import { FileImage, Users, TrendingUp, Clock } from 'lucide-react';
import { useFloorplanStore } from '../stores/floorplanStore';
import { useMobileUploadsStore } from '../stores/mobileUploads';
import { MobileUploadsSection } from '../components/dashboard/MobileUploadsSection';
import { StatCard } from '../components/ui/StatCard';
import { StatCardSkeleton } from '../components/ui/Skeleton';

const Dashboard: React.FC = () => {
  const { submissions, fetchSubmissions, isLoading: submissionsLoading } = useFloorplanStore();
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
        {submissionsLoading ? (
          <>
            {[...Array(4)].map((_, index) => (
              <StatCardSkeleton key={index} />
            ))}
          </>
        ) : (
          <>
            <StatCard
              title="Pending Review"
              value={stats.pending}
              icon={Clock}
              color="yellow"
              delay={0}
            />
            
            <StatCard
              title="Approved"
              value={stats.approved}
              icon={TrendingUp}
              color="green"
              delay={200}
            />
            
            <StatCard
              title="Denied"
              value={stats.rejected}
              icon={FileImage}
              color="red"
              delay={400}
            />
            
            <StatCard
              title="Total Reviewed"
              value={stats.total}
              icon={Users}
              color="blue"
              delay={600}
            />
          </>
        )}
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