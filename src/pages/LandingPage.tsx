import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, TrendingUp, Clock } from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ThemeToggle } from '../components/ui/ThemeToggle';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: TrendingUp,
      title: 'Accurate Predictions',
      description: 'AI-powered cost estimation for residential floorplans'
    },
    {
      icon: Clock,
      title: 'Fast Processing',
      description: 'Quick turnaround times for cost estimates'
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'Admin-reviewed submissions ensure accuracy'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <div className="flex items-center gap-3">
              <ThemeToggle size="md" />
              <Button 
                variant="outline"
                onClick={() => navigate('/admin/login')}
              >
                Admin Access
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-200">
            Smart Land Pricing Solutions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto transition-colors duration-200">
            Revolutionary floorplan analysis system that provides accurate building cost estimates 
            through advanced AI prediction technology.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/admin/login')}
            className="shadow-lg"
          >
            Access Admin Dashboard
          </Button>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 dark:bg-teal-900/50 rounded-full mb-4 transition-colors duration-200">
                <feature.icon className="w-8 h-8 text-teal-700 dark:text-teal-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-200">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* CTA section */}
        <div className="bg-teal-700 dark:bg-teal-800 rounded-2xl p-8 lg:p-12 text-center text-white transition-colors duration-200">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Review Submissions?
          </h2>
          <p className="text-teal-100 dark:text-teal-200 mb-6 text-lg transition-colors duration-200">
            Access the admin dashboard to review and approve floorplan submissions.
          </p>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/admin/login')}
            className="bg-white text-teal-700 hover:bg-gray-50 border-white dark:bg-gray-100 dark:hover:bg-gray-200"
          >
            Sign In to Dashboard
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600 dark:text-gray-300 transition-colors duration-200">
          <p>&copy; 2025 TerraPrice. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;