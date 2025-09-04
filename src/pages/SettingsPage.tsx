import React from 'react';
import { Settings } from 'lucide-react';
import { Card } from '../components/ui/Card';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Configure application settings and preferences
        </p>
      </div>

      <Card className="text-center py-12">
        <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Application Settings
        </h3>
        <p className="text-gray-600">
          Settings panel will be available once the application is connected to the backend
        </p>
      </Card>
    </div>
  );
};

export default SettingsPage;