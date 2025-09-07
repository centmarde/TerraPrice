import React, { useEffect, useState } from 'react';
import { Search, Filter, FileImage } from 'lucide-react';
import { useFloorplanStore } from '../stores/floorplanStore';
import { FloorplanSubmission } from '../types';
import { FloorplanCard } from '../components/floorplan/FloorplanCard';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const FloorplanList: React.FC = () => {
  const { submissions, isLoading, fetchSubmissions } = useFloorplanStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FloorplanSubmission['status'] | 'all'>('all');

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.userDetails.fullName
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
      submission.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    denied: submissions.filter(s => s.status === 'denied').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Floorplan Submissions</h1>
        <p className="text-gray-600">
          Review and manage all floorplan submissions
        </p>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 lg:max-w-md">
            <Input
              placeholder="Search by user name or submission ID..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            {(['all', 'pending', 'approved', 'denied'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  statusFilter === status
                    ? 'bg-teal-100 text-teal-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Submissions list */}
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <Card className="text-center py-12">
            <FileImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || statusFilter !== 'all' 
                ? 'No matching submissions' 
                : 'No submissions yet'
              }
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Submissions will appear here when users upload floorplans'
              }
            </p>
            {(searchQuery || statusFilter !== 'all') && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredSubmissions.map((submission) => (
              <FloorplanCard key={submission.id} submission={submission} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FloorplanList;