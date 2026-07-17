import styles from './Button.module.css'

function Button({ children, variant = 'primary', href, onClick, type = 'button', className = '' }) {
  const classes = `${styles.btn} ${variant === 'secondary' ? styles.secondary : styles.primary} ${className}`

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button
