import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaCoffee, FaBars, FaTimes } from 'react-icons/fa'
import Button from './Button'
import styles from './Navbar.module.css'
import { isAuthenticated, logout, isAdmin } from '../services/api'

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Menu', href: '#menu' },
  { label: 'Mixology', href: '#mixology' },
  { label: 'About', href: '#about' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const [isAuth, setIsAuth] = useState(isAuthenticated())
  const [userIsAdmin, setUserIsAdmin] = useState(isAdmin())

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsAuth(isAuthenticated())
    setUserIsAdmin(isAdmin())
  }, [location])

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    logout()
    setIsAuth(false)
    setUserIsAdmin(false)
    closeMenu()
    window.location.href = '/'
  }

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <a href="#home" className={styles.logo} onClick={closeMenu}>
          <FaCoffee aria-hidden="true" />
          <span>Brew Haven</span>
        </a>

        <nav className={`${styles.links} ${menuOpen ? styles.linksOpen : ''}`}>
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                {link.href.startsWith('#') ? (
                  <a href={link.href} onClick={closeMenu}>
                    {link.label}
                  </a>
                ) : (
                  <Link to={link.href} onClick={closeMenu}>
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
            {isAuth && userIsAdmin && (
              <li>
                <Link to="/admin" onClick={closeMenu}>
                  Admin
                </Link>
              </li>
            )}
          </ul>
          {isAuth ? (
            <Button onClick={handleLogout} className={styles.mobileOrderBtn}>
              Logout
            </Button>
          ) : (
            <Button href="/login" onClick={closeMenu} className={styles.mobileOrderBtn}>
              Login
            </Button>
          )}
        </nav>

        <div className={styles.actions}>
          {isAuth ? (
            <Button onClick={handleLogout} className={styles.desktopOrderBtn}>
              Logout
            </Button>
          ) : (
            <Button href="/login" className={styles.desktopOrderBtn}>
              Login
            </Button>
          )}
          <button
            className={styles.toggle}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar

