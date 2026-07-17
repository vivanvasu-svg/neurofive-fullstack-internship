import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCoffee, FaLock, FaUser } from 'react-icons/fa';
import api from '../services/api';
import styles from './Login.module.css';

function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    // After login/register, redirect to the page they tried to access.
    // Default is '/' for customers; /admin only shows up if they were redirected from there.
    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();

        const usernameTrimmed = username.trim();

        // Client-side validations
        if (!usernameTrimmed || !password.trim()) {
            setError('Please fill in all fields.');
            return;
        }

        if (usernameTrimmed.length < 3) {
            setError('Username must be at least 3 characters.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (isRegister) {
            if (!confirmPassword.trim()) {
                setError('Please confirm your password.');
                return;
            }
            if (password !== confirmPassword) {
                setError('Passwords do not match.');
                return;
            }
        }

        setLoading(true);
        setError(null);

        try {
            let result;
            if (isRegister) {
                result = await api.register(usernameTrimmed, password);
            } else {
                result = await api.login(usernameTrimmed, password);
            }
            // Admins go to /admin, customers go to homepage
            const destination = result?.role === 'admin' ? '/admin' : (from === '/admin' ? '/' : from);
            navigate(destination, { replace: true });
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else if (err.response && err.response.status === 401) {
                setError('Invalid username or password');
            } else {
                setError('Unable to connect to the server. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <FaCoffee />
                    </div>
                    <h2 className={styles.title}>Brew Haven</h2>
                    <p className={styles.subtitle}>{isRegister ? 'Create your account to start ordering' : 'Sign in to your account'}</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <div className={styles.error} role="alert">{error}</div>}

                    <div className={styles.field}>
                        <label htmlFor="username" className={styles.label}>
                            Username
                        </label>
                        <div className={styles.inputWrapper}>
                            <FaUser className={styles.icon} />
                            <input
                                type="text"
                                id="username"
                                className={styles.input}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={loading}
                                placeholder="Enter username"
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="password" className={styles.label}>
                            Password
                        </label>
                        <div className={styles.inputWrapper}>
                            <FaLock className={styles.icon} />
                            <input
                                type="password"
                                id="password"
                                className={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                placeholder="Enter password"
                                autoComplete={isRegister ? 'new-password' : 'current-password'}
                            />
                        </div>
                    </div>

                    {isRegister && (
                        <div className={styles.field}>
                            <label htmlFor="confirmPassword" className={styles.label}>
                                Confirm Password
                            </label>
                            <div className={styles.inputWrapper}>
                                <FaLock className={styles.icon} />
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    className={styles.input}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    placeholder="Confirm password"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>
                    )}

                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? 'Authenticating...' : (isRegister ? 'Sign Up' : 'Login')}
                    </button>

                    <p className={styles.toggleText}>
                        {isRegister ? 'Already have an account?' : "Don't have an account?"}
                        <button
                            type="button"
                            onClick={() => {
                                setIsRegister(!isRegister);
                                setError(null);
                                setUsername('');
                                setPassword('');
                                setConfirmPassword('');
                            }}
                            className={styles.toggleBtn}
                            disabled={loading}
                        >
                            {isRegister ? 'Login' : 'Sign Up'}
                        </button>
                    </p>
                </form>

                <div className={styles.footer}>
                    <a href="/" className={styles.backLink}>
                        Return to Homepage
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Login;

