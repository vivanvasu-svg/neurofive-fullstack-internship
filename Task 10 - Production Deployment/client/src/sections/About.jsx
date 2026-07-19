import { FaCheckCircle } from 'react-icons/fa'
import styles from './About.module.css'

const CHECKLIST = ['Premium Beans', 'Organic Ingredients', 'Friendly Staff', 'Cozy Workspace']

function About() {
  return (
    <section id="about" className="section">
      <div className={`container ${styles.grid}`}>
        <div className={styles.imageWrap}>
          <img
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80"
            alt="Interior of Brew Haven coffee shop with warm lighting and wooden furniture"
            loading="lazy"
          />
        </div>

        <div className={styles.content}>
          <span className={styles.eyebrow}>Our Story</span>
          <h2 className={styles.title}>About Brew Haven</h2>
          <p className={styles.text}>
            Brew Haven started as a small neighborhood counter with one mission: serve honest,
            high-quality coffee in a space that feels like home. Today, we're proud to be the spot
            where regulars catch up, students study, and remote workers get things done — one cup
            at a time.
          </p>

          <ul className={styles.checklist}>
            {CHECKLIST.map((item) => (
              <li key={item}>
                <FaCheckCircle aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default About
