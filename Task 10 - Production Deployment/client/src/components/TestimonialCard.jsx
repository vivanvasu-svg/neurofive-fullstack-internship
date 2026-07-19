import { FaStar } from 'react-icons/fa'
import styles from './TestimonialCard.module.css'

function TestimonialCard({ quote, name, role }) {
  return (
    <div className={styles.card}>
      <div className={styles.stars} role="img" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <FaStar key={i} aria-hidden="true" />
        ))}
      </div>
      <p className={styles.quote}>&ldquo;{quote}&rdquo;</p>
      <div className={styles.author}>
        <span className={styles.name}>{name}</span>
        {role && <span className={styles.role}>{role}</span>}
      </div>
    </div>
  )
}

export default TestimonialCard
