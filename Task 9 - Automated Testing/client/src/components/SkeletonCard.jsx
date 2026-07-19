import styles from './SkeletonCard.module.css';

function SkeletonCard({ variant = 'coffee' }) {
    if (variant === 'testimonial') {
        return (
            <div className={`${styles.skeleton} ${styles.testimonial}`} aria-hidden="true">
                <div className={styles.skeletonLine} style={{ width: '100%', height: '14px', marginBottom: '8px' }} />
                <div className={styles.skeletonLine} style={{ width: '85%', height: '14px', marginBottom: '8px' }} />
                <div className={styles.skeletonLine} style={{ width: '70%', height: '14px', marginBottom: '20px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className={styles.skeletonAvatar} />
                    <div>
                        <div className={styles.skeletonLine} style={{ width: '100px', height: '12px', marginBottom: '6px' }} />
                        <div className={styles.skeletonLine} style={{ width: '70px', height: '11px' }} />
                    </div>
                </div>
            </div>
        );
    }

    // Default: coffee card skeleton
    return (
        <div className={styles.skeleton} aria-hidden="true">
            <div className={styles.skeletonImage} />
            <div className={styles.skeletonBody}>
                <div className={styles.skeletonLine} style={{ width: '60%', height: '18px', marginBottom: '10px' }} />
                <div className={styles.skeletonLine} style={{ width: '100%', height: '13px', marginBottom: '6px' }} />
                <div className={styles.skeletonLine} style={{ width: '80%', height: '13px', marginBottom: '20px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className={styles.skeletonLine} style={{ width: '50px', height: '22px' }} />
                    <div className={styles.skeletonBtn} />
                </div>
            </div>
        </div>
    );
}

export default SkeletonCard;
