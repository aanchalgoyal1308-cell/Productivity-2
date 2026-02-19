import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function ProtectedRoute() {
    const { user } = useAuthStore();
    const location = useLocation();

    if (!user) {
        // Redirect to login page with the return url
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}
