import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../services/api';

function ProtectedRoute({ children }) {
    const location = useLocation();

    if (!isAuthenticated() || !isAdmin()) {
        // Redirect to login page and keep source route state
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

export default ProtectedRoute;
