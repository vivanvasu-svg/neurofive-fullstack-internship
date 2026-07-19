import styles from './EmptyState.module.css';

function EmptyState({ icon = '☕', title = 'Nothing here yet', description = '', action = null }) {
    return (
        <div className={styles.wrapper} role="status" aria-label={title}>
            <div className={styles.iconRing}>
                <span className={styles.icon}>{icon}</span>
            </div>
            <h3 className={styles.title}>{title}</h3>
            {description && <p className={styles.description}>{description}</p>}
            {action && <div className={styles.action}>{action}</div>}
        </div>
    );
}

export default EmptyState;
