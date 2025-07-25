import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../../app/store';
import { fetchUser } from '../authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Try to fetch user if not authenticated
    if (!isAuthenticated) {
      dispatch(fetchUser());
    }
  }, [dispatch, isAuthenticated]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "480px",
          margin: "0 auto",
          overflow: "hidden",
          minHeight: "100vh",
          background:
            "radial-gradient(98.1% 98.1% at 97.18% 1.13%, #FFE4E5 41.83%, #FFFCE5 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>Checking authentication...</div>
      </div>
    );
  }

  // Redirect to onboarding if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/user/onboarding/1" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;