import { createContext, useContext, useState, useCallback } from 'react';
import { isAuthenticated as checkAuth, isAdmin as checkAdmin } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [isAuth, setIsAuth] = useState(() => checkAuth());
    const [userIsAdmin, setUserIsAdmin] = useState(() => checkAdmin());
    const [username, setUsername] = useState(() => localStorage.getItem('admin_user') || '');

    const login = useCallback((token, uname, role) => {
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', uname);
        localStorage.setItem('admin_role', role || 'customer');
        setIsAuth(true);
        setUserIsAdmin(role === 'admin');
        setUsername(uname);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_role');
        setIsAuth(false);
        setUserIsAdmin(false);
        setUsername('');
    }, []);

    return (
        <AuthContext.Provider value={{ isAuth, userIsAdmin, username, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}

export default AuthContext;
