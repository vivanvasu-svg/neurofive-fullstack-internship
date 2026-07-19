import styles from './ErrorMessage.module.css';

function ErrorMessage({ message = 'An error occurred. Please try again.' }) {
    return (
        <div className={styles.errorContainer} role="alert">
            <p className={styles.message}>{message}</p>
        </div>
    );
}

export default ErrorMessage;
