import { useEffect, useState } from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { routes } from './routes';

function AppRoutes() {
  const routing = useRoutes(routes);
  return routing;
}

function App() {
  const { checkAuth, isLoading } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setIsInitialized(true);
    };
    initAuth();
  }, [checkAuth]);

  // Show loading screen while initializing authentication
  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;