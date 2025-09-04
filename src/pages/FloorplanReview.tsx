import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Home } from 'lucide-react';
import { useFloorplanStore } from '../stores/floorplanStore';
import { FloorplanViewer } from '../components/floorplan/FloorplanViewer';
import { ApprovalControls } from '../components/floorplan/ApprovalControls';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';

const FloorplanReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedSubmission, selectSubmission, updateSubmissionStatus, isLoading } = useFloorplanStore();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      selectSubmission(id);
    }
  }, [id, selectSubmission]);

  const handleStatusUpdate = async (status: 'approved' | 'rejected', notes?: string) => {
    if (!selectedSubmission) return;
    
    setIsUpdating(true);
    try {
      await updateSubmissionStatus(selectedSubmission.id, status, notes);
      // Optionally navigate back to list or show success message
    } catch (error) {
      console.error('Failed to update status:', error);
    }
    setIsUpdating(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  if (isLoading || !selectedSubmission) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate('/admin/floorplans')}
          >
            Back to List
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Submission Review
            </h1>
            <p className="text-gray-600">
              ID: {selectedSubmission.id}
            </p>
          </div>
        </div>
        <StatusBadge status={selectedSubmission.status} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content - Floorplan viewer */}
        <div className="lg:col-span-2 space-y-6">
          <FloorplanViewer 
            imageUrl={selectedSubmission.imageUrl}
            alt={`Floorplan for ${selectedSubmission.userDetails.fullName}`}
          />

          {/* Cost estimation */}
          <Card>
            <CardHeader 
              title="Cost Estimation"
              subtitle="AI-generated building cost estimate"
            />
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Cost</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(selectedSubmission.estimatedCost)}
                  </p>
                </div>
              </div>
              {selectedSubmission.squareFootage && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Home className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Square Footage</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {selectedSubmission.squareFootage.toLocaleString()} sq ft
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User information */}
          <Card>
            <CardHeader title="User Information" />
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <User className="w-4 h-4 text-gray-400 mr-3" />
                <span className="font-medium">{selectedSubmission.userDetails.fullName}</span>
              </div>
              <div className="flex items-center text-sm">
                <Mail className="w-4 h-4 text-gray-400 mr-3" />
                <span>{selectedSubmission.userDetails.email}</span>
              </div>
              {selectedSubmission.userDetails.phoneNumber && (
                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 text-gray-400 mr-3" />
                  <span>{selectedSubmission.userDetails.phoneNumber}</span>
                </div>
              )}
              {selectedSubmission.location && (
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                  <span>{selectedSubmission.location}</span>
                </div>
              )}
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                <span>Submitted {formatDate(selectedSubmission.submittedAt)}</span>
              </div>
            </div>
          </Card>

          {/* Approval controls */}
          <ApprovalControls 
            submission={selectedSubmission}
            onStatusUpdate={handleStatusUpdate}
            isLoading={isUpdating}
          />
        </div>
      </div>
    </div>
  );
};

export default FloorplanReview;