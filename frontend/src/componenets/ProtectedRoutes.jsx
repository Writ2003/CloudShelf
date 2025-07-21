import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({allowedUser}) => {
  const { loading, user, userType } = useAuth();
  const location = useLocation();

  if (loading) return <p>Loading...</p>;
  
  if(!user) return <Navigate to="/login" replace />;
  if (allowedUser && userType !== allowedUser) {
    return <Navigate to="/login" replace />;
  }
  if (location.pathname === "/") {
    return <Navigate to={`/${userType.toLowerCase()}`} replace />;
  }
  return <Outlet />; // ✅ Allow nested routes to render
};

export default ProtectedRoute;
