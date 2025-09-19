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
    <div className="landing-container min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-4">
          <div className="flex items-center justify-between h-16 sm:h-auto min-h-0">
            <div className="flex-shrink-0">
              <Logo size="sm" showText={true} className="sm:hidden" />
              <Logo size="md" showText={true} className="hidden sm:block" />
            </div>
            <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
              <ThemeToggle size="sm" className="sm:hidden" />
              <ThemeToggle size="md" className="hidden sm:block" />
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/login')}
                className="text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 flex-shrink-0 whitespace-nowrap"
              >
                <span className="hidden sm:inline">Admin Access</span>
                <span className="sm:hidden">Admin</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-16">
        {/* Hero section */}
        <div className="text-center mb-8 sm:mb-16 animate-fadeInUp">
          <h1 className="hero-title text-xl xs:text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-6 transition-colors duration-200 px-1 sm:px-2 leading-tight max-w-4xl mx-auto">
            Smart Land Pricing Solutions
          </h1>
          <p className="hero-description text-sm xs:text-base sm:text-xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-8 max-w-3xl mx-auto transition-colors duration-200 px-2 sm:px-4 animate-fadeInUp animate-delay-200 opacity-0 leading-relaxed">
            Revolutionary floorplan analysis system that provides accurate building cost estimates 
            through advanced AI prediction technology.
          </p>
          <div className="animate-fadeInUp animate-delay-400 opacity-0 px-2 sm:px-0">
            <Button 
              size="md"
              onClick={() => navigate('/admin/login')}
              className="shadow-lg sm:hidden w-full max-w-xs mx-auto"
            >
              Access Dashboard
            </Button>
            <Button 
              size="lg"
              onClick={() => navigate('/admin/login')}
              className="shadow-lg hidden sm:inline-flex"
            >
              Access Admin Dashboard
            </Button>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 mb-8 sm:mb-16 px-1 sm:px-0">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`text-center p-3 sm:p-6 animate-fadeInUp animate-delay-${(index + 2) * 100} opacity-0`}
              hover={true}
            >
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 bg-teal-100 dark:bg-teal-900/50 rounded-full mb-2 sm:mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-teal-200 dark:group-hover:bg-teal-900/70">
                <feature.icon className="w-5 h-5 sm:w-8 sm:h-8 text-teal-700 dark:text-teal-300 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 transition-colors duration-200">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-base text-gray-600 dark:text-gray-300 transition-colors duration-200 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* CTA section */}
        <div className="bg-teal-700 dark:bg-teal-800 rounded-lg sm:rounded-2xl p-4 sm:p-8 lg:p-12 text-center text-white transition-all duration-300 hover:bg-teal-800 dark:hover:bg-teal-700 transform hover:scale-[1.02] animate-fadeInUp animate-delay-500 opacity-0 mx-1 sm:mx-0">
          <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4 leading-tight">
            Ready to Review Submissions?
          </h2>
          <p className="text-teal-100 dark:text-teal-200 mb-3 sm:mb-6 text-xs xs:text-sm sm:text-base lg:text-lg transition-colors duration-200 leading-relaxed px-1 sm:px-0">
            Access the admin dashboard to review and approve floorplan submissions.
          </p>
          <Button 
            variant="outline" 
            size="md"
            onClick={() => navigate('/admin/login')}
            className="bg-white text-teal-700 hover:bg-gray-50 border-white dark:bg-gray-100 dark:hover:bg-gray-200 sm:hidden w-full max-w-xs"
          >
            Sign In
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/admin/login')}
            className="bg-white text-teal-700 hover:bg-gray-50 border-white dark:bg-gray-100 dark:hover:bg-gray-200 hidden sm:inline-flex"
          >
            Sign In to Dashboard
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 sm:py-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 text-center text-gray-600 dark:text-gray-300 transition-colors duration-200">
          <p className="text-xs sm:text-base">&copy; 2025 TerraPrice. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;