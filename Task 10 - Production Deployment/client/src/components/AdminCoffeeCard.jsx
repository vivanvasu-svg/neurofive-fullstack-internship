import styles from './AdminCoffeeCard.module.css';

function AdminCoffeeCard({ coffee, onEdit, onDelete, disabled }) {
    const { name, description, price, category, image } = coffee;

    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <img
                    src={image}
                    alt={`${name} coffee management preview`}
                    className={styles.image}
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800';
                    }}
                />
                <span className={styles.category}>{category}</span>
            </div>
            <div className={styles.content}>
                <h4 className={styles.name}>{name}</h4>
                <p className={styles.description}>{description}</p>
                <div className={styles.footer}>
                    <span className={styles.price}>${price.toFixed(2)}</span>
                    <div className={styles.actions}>
                        <button
                            onClick={() => onEdit(coffee)}
                            className={styles.editBtn}
                            disabled={disabled}
                            aria-label={`Edit ${name}`}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(coffee.id)}
                            className={styles.deleteBtn}
                            disabled={disabled}
                            aria-label={`Delete ${name}`}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminCoffeeCard;
