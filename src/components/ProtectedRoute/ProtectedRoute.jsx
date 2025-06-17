import { Navigate } from "react-router-dom";
import { useAppContext } from "../../store/AppContext";

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, isLoading } = useAppContext(); // Add isLoading

  // Show loading while checking authentication
  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  // If route requires authentication but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If route doesn't require authentication (login page) but user is authenticated
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
