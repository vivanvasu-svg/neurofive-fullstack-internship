import { useEffect, useRef } from 'react';
import styles from './Toast.module.css';

function Toast({ message, type = 'success', onClose }) {
    const timerRef = useRef(null);

    useEffect(() => {
        timerRef.current = setTimeout(() => {
            onClose();
        }, 4500);
        return () => clearTimeout(timerRef.current);
    }, [onClose]);

    return (
        <div className={`${styles.toast} ${styles[type]}`} role="alert" aria-live="polite">
            <span className={styles.icon}>
                {type === 'success' ? '✓' : '✕'}
            </span>
            <p className={styles.message}>{message}</p>
            <button
                className={styles.close}
                onClick={onClose}
                aria-label="Dismiss notification"
            >
                ×
            </button>
        </div>
    );
}

export default Toast;
