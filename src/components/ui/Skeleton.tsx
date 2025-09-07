import React from 'react';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', children }) => {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}>
      {children}
    </div>
  );
};

// Stat Card Skeleton
export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-800 border-2 border-gray-700 rounded-xl p-4 lg:p-6">
      <div className="flex items-center gap-2 lg:gap-3">
        <Skeleton className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg" />
        <div className="min-w-0">
          <Skeleton className="h-3 lg:h-4 w-20 mb-2" />
          <Skeleton className="h-8 lg:h-9 w-12" />
        </div>
      </div>
    </div>
  );
};

// Upload Card Skeleton
export const UploadCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center gap-4">
        {/* Thumbnail skeleton */}
        <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
        
        {/* Content skeleton */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="w-16 h-6 rounded-full ml-2" />
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Skeleton className="w-3 h-3 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="w-3 h-3 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          
          {/* Action buttons skeleton */}
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Upload List Skeleton
export const UploadListSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <UploadCardSkeleton key={index} />
      ))}
    </div>
  );
};

// Button Skeleton
export const ButtonSkeleton: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-16',
    md: 'h-10 w-24',
    lg: 'h-12 w-32'
  };
  
  return <Skeleton className={`${sizeClasses[size]} rounded-md`} />;
};

// Form Skeleton
export const FormSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div key={index}>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
      <ButtonSkeleton size="lg" />
    </div>
  );
};

// Dashboard Skeleton
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header skeleton */}
      <div>
        <Skeleton className="h-8 lg:h-9 w-48 mb-2" />
        <Skeleton className="h-4 lg:h-5 w-96" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[...Array(4)].map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      {/* Mobile uploads section skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        
        {/* Controls skeleton */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        
        {/* Content skeleton */}
        <div className="p-4">
          <UploadListSkeleton />
          
          {/* Pagination skeleton */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              <Skeleton className="w-8 h-8 rounded" />
              <Skeleton className="w-8 h-8 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
