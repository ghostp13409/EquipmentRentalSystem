import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import PageMeta from '../../components/common/PageMeta';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check authentication status
      try {
        const authResult = await checkAuth();
        
        if (authResult.isAuthenticated && authResult.user) {
            // Redirect if authenticated
            navigate('/', { replace: true });
        } else {
          // else redirect to sign in
          navigate('/signin', { replace: true });
        }
      } catch (error) {
        console.error('Error handling OAuth callback:', error);
        navigate('/signin', { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <>
      <PageMeta
        title="Signing in..."
        description="Processing your Google sign in"
      />
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Completing sign in...</p>
        </div>
      </div>
    </>
  );
}
