import { Navigate, Outlet } from "react-router-dom";
import useAuth from '../hooks/useAuth';

const ProtectedRoute = () => {
    const { loading, user } = useAuth();
    if (loading) return <p>Loading...</p>;
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
