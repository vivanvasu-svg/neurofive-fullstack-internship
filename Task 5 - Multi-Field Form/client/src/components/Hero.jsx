import { FaStar } from 'react-icons/fa'
import Button from './Button'
import styles from './Hero.module.css'

function Hero() {
  return (
    <section id="home" className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <h1 className={styles.heading}>Fresh Coffee, Made With Passion.</h1>
          <p className={styles.subtext}>
            Brew Haven roasts small batches of single-origin beans every morning, so every cup you
            order is warm, bold, and made just for you.
          </p>

          <div className={styles.actions}>
            <Button href="#contact">Order Now</Button>
            <Button href="#menu" variant="secondary">
              Explore Menu
            </Button>
          </div>

          <div className={styles.badge}>
            <span className={styles.stars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar key={i} aria-hidden="true" />
              ))}
            </span>
            <span>Trusted by 10,000+ coffee lovers</span>
          </div>
        </div>

        <div className={styles.imageWrap}>
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80"
            alt="Barista pouring latte art into a cup of freshly brewed coffee"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
