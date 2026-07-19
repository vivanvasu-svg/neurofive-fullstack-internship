import { FaCoffee, FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa'
import styles from './Footer.module.css'

const QUICK_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Menu', href: '#menu' },
  { label: 'About', href: '#about' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
]

const HOURS = [
  { day: 'Monday – Friday', time: '7:00 AM – 9:00 PM' },
  { day: 'Saturday', time: '8:00 AM – 10:00 PM' },
  { day: 'Sunday', time: '8:00 AM – 6:00 PM' },
]

const SOCIALS = [
  { icon: FaFacebookF, label: 'Facebook', href: '#' },
  { icon: FaInstagram, label: 'Instagram', href: '#' },
  { icon: FaTwitter, label: 'Twitter', href: '#' },
]

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brandCol}>
          <a href="#home" className={styles.logo}>
            <FaCoffee aria-hidden="true" />
            <span>Brew Haven</span>
          </a>
          <p className={styles.tagline}>Fresh coffee, made with passion — every single cup.</p>
        </div>

        <div className={styles.col}>
          <h4>Quick Links</h4>
          <ul>
            {QUICK_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h4>Opening Hours</h4>
          <ul className={styles.hours}>
            {HOURS.map((slot) => (
              <li key={slot.day}>
                <span>{slot.day}</span>
                <span>{slot.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h4>Follow Us</h4>
          <div className={styles.socials}>
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} aria-label={label} className={styles.socialIcon}>
                <Icon aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} Brew Haven. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
