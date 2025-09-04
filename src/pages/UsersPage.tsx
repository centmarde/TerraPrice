import React from 'react';
import { Users } from 'lucide-react';
import { Card } from '../components/ui/Card';

const UsersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
        <p className="text-gray-600">
          Manage user accounts and permissions
        </p>
      </div>

      <Card className="text-center py-12">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          User Management
        </h3>
        <p className="text-gray-600">
          This section will display user accounts and management tools once connected to Supabase
        </p>
      </Card>
    </div>
  );
};

export default UsersPage;