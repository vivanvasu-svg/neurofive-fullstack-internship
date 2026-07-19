import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
    const location = useLocation();
    const { isAuth, userIsAdmin } = useAuth();

    if (!isAuth || !userIsAdmin) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

export default ProtectedRoute;
