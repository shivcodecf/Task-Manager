import { useAuth } from "./contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // 1. Wait for auth to finish loading
  if (loading) {
    return <div>Loading...</div>; // Or your loading spinner
  }

  // 2. If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If user is not authorized, redirect to their role-specific route
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }
 

  // 4. If everything is fine, render children
  return children;
};

export default ProtectedRoute;
