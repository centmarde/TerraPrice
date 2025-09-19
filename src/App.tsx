import { useEffect, useState } from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from './stores/authStore';
import { ThemeProvider } from './contexts/ThemeContext';
import { FullScreenLoader } from './components/ui/Loader';
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
      try {
        await checkAuth();
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn('Auth initialization timeout - forcing initialization');
      setIsInitialized(true);
    }, 3000); // 3 seconds timeout (reduced from 5)
    
    initAuth().finally(() => {
      clearTimeout(timeout);
    });
  }, [checkAuth]);

  // Show loading screen while initializing authentication
  if (!isInitialized || isLoading) {
    return (
      <ThemeProvider>
        <FullScreenLoader text="Initializing TerraPrice..." />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <AppRoutes />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;