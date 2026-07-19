import styles from './LoadingSpinner.module.css';

function LoadingSpinner({ message = 'Loading...' }) {
    return (
        <div className={styles.spinnerContainer} role="status">
            <div className={styles.spinner}></div>
            <p className={styles.message}>{message}</p>
        </div>
    );
}

export default LoadingSpinner;
