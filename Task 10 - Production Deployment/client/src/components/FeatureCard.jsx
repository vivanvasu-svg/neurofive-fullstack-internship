import styles from './FeatureCard.module.css'

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrap}>
        <Icon aria-hidden="true" />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  )
}

export default FeatureCard
