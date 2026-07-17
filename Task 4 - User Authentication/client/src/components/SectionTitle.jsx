import styles from './SectionTitle.module.css'

function SectionTitle({ eyebrow, title, description, align = 'center' }) {
  return (
    <div className={`${styles.wrap} ${align === 'left' ? styles.left : ''}`}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  )
}

export default SectionTitle
