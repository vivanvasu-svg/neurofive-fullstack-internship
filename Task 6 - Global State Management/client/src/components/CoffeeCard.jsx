import Button from './Button'
import styles from './CoffeeCard.module.css'

function CoffeeCard({ image, name, description, price, onOrder }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          src={image}
          alt={`${name} served at Brew Haven`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800';
          }}
        />
      </div>
      <div className={styles.body}>
        <div className={styles.headerRow}>
          <h3 className={styles.name}>{name}</h3>
          <span className={styles.price}>{price}</span>
        </div>
        <p className={styles.description}>{description}</p>
        <Button variant="secondary" className={styles.orderBtn} onClick={onOrder}>
          Order
        </Button>
      </div>
    </div>
  )
}

export default CoffeeCard
