import Button from '../components/Button'
import styles from './Contact.module.css'

function Contact() {
  return (
    <section id="contact" className={`section ${styles.contact}`}>
      <div className={`container ${styles.inner}`}>
        <h2 className={styles.title}>Ready for your next cup?</h2>
        <p className={styles.text}>
          Stop by Brew Haven today and taste the difference that fresh beans and genuine care make.
        </p>
        <Button href="#" className={styles.cta}>
          Find Us
        </Button>
      </div>
    </section>
  )
}

export default Contact
