import styles from './AdminCoffeeCard.module.css';

function AdminCoffeeCard({ coffee, onEdit, onDelete, disabled }) {
    const { name, description, price, category, image } = coffee;

    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <img src={image} alt={name} className={styles.image} />
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
