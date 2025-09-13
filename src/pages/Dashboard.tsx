import React, { useEffect } from 'react';
import { FileImage, Users, TrendingUp, Clock } from 'lucide-react';
import { useFloorplanStore } from '../stores/floorplanStore';
import { useMobileUploadsStore } from '../stores/mobileUploads';
import { MobileUploadsSection } from '../components/dashboard/MobileUploadsSection';
import { StatCard } from '../components/ui/StatCard';
import { StatCardSkeleton } from '../components/ui/Skeleton';

const Dashboard: React.FC = () => {
  const { submissions, fetchSubmissions, isLoading: submissionsLoading } = useFloorplanStore();
  const { uploads, isLoading: uploadsLoading, fetchUploads, subscribeToUploads, unsubscribeFromUploads } = useMobileUploadsStore();

  useEffect(() => {
    fetchSubmissions();
    fetchUploads();
    
    // Subscribe to realtime updates for mobile uploads
    subscribeToUploads();
    
    // Cleanup subscription on unmount
    return () => {
      unsubscribeFromUploads();
    };
  }, [fetchSubmissions, fetchUploads, subscribeToUploads, unsubscribeFromUploads]);

  // Calculate statistics (will work with real data when connected to Supabase)
  const stats = {
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
    total: submissions.length
  };

  console.log('Dashboard Debug:', {
    realUploadsCount: uploads.length,
    realSubmissionsCount: submissions.length,
    isLoadingUploads: uploadsLoading,
    isLoadingSubmissions: submissionsLoading
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
        uploads={uploads} 
        isLoading={uploadsLoading}
      />
    </div>
  );
};

export default Dashboard;