import { useEffect, useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import CoffeeCard from '../components/CoffeeCard'
import Button from '../components/Button'
import api from '../services/api'
import styles from './Menu.module.css'

const STATIC_COFFEES = [
  {
    name: 'Espresso',
    description: 'A bold, concentrated shot with a rich crema and intense aroma.',
    price: 3.50,
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Cappuccino',
    description: 'Espresso topped with steamed milk and a thick layer of velvety foam.',
    price: 4.25,
    image: 'https://images.pexels.com/photos/350584/pexels-photo-350584.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Latte',
    description: 'Smooth espresso balanced with steamed milk and light, silky foam.',
    price: 4.50,
    image: 'https://images.pexels.com/photos/3953477/pexels-photo-3953477.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Mocha',
    description: 'Espresso and steamed milk swirled with rich, decadent chocolate.',
    price: 4.75,
    image: 'https://images.pexels.com/photos/1570779/pexels-photo-1570779.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Cold Brew',
    description: 'Steeped slowly in cold water for 24 hours, delivering an ultra-smooth, naturally sweet flavor.',
    price: 4.50,
    image: 'https://images.pexels.com/photos/2638019/pexels-photo-2638019.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Macchiato',
    description: 'Bold espresso marked with a small dollop of creamy, aerated foam.',
    price: 3.75,
    image: 'https://images.pexels.com/photos/4108774/pexels-photo-4108774.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Affogato',
    description: 'A decadent scoop of creamy vanilla bean gelato drowned in a hot shot of espresso.',
    price: 5.50,
    image: 'https://images.pexels.com/photos/6205590/pexels-photo-6205590.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Flat White',
    description: 'Double shot of rich espresso topped with smooth micro-foamed milk for a velvety finish.',
    price: 4.25,
    image: 'https://images.pexels.com/photos/5946971/pexels-photo-5946971.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
]

function Menu() {
  const [coffees, setCoffees] = useState([])
  const [selectedCoffee, setSelectedCoffee] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    const fetchCoffees = async () => {
      try {
        const data = await api.getCoffees()
        if (data && data.length > 0) {
          setCoffees(data)
        } else {
          setCoffees(STATIC_COFFEES)
        }
      } catch (err) {
        console.error('Error fetching coffees:', err)
        setCoffees(STATIC_COFFEES)
      }
    }
    fetchCoffees()
    setIsAuth(api.isAuthenticated())
  }, [])

  const handleOrderClick = (coffee) => {
    setSelectedCoffee(coffee)
    setQuantity(1)
    setOrderSuccess(false)
    setOrderError('')
  }

  const parsePrice = (priceVal) => {
    if (typeof priceVal === 'number') return priceVal
    if (typeof priceVal === 'string') {
      const parsed = parseFloat(priceVal.replace(/[^0-9.]/g, ''))
      return isNaN(parsed) ? 0 : parsed
    }
    return 0
  }

  const formatPrice = (priceVal) => {
    const num = parsePrice(priceVal)
    return `$${num.toFixed(2)}`
  }

  const handleConfirmOrder = async (e) => {
    e.preventDefault()
    if (!isAuth) {
      // Redirect to login
      window.location.href = '/login'
      return
    }

    if (quantity < 1) {
      setOrderError('Quantity must be at least 1')
      return
    }

    setLoading(true)
    setOrderError('')

    const price = parsePrice(selectedCoffee.price)
    const totalPrice = price * quantity

    try {
      await api.createOrder({
        coffeeName: selectedCoffee.name,
        quantity: Number(quantity),
        totalPrice,
      })
      setOrderSuccess(true)
    } catch (err) {
      console.error(err)
      setOrderError('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="menu" className="section section--muted">
      <div className="container">
        <SectionTitle
          eyebrow="Popular Picks"
          title="Our Coffee Menu"
          description="Handcrafted classics, made fresh to order every single time."
        />
        <div className={styles.grid}>
          {coffees.map((coffee) => (
            <CoffeeCard
              key={coffee.name}
              image={coffee.image}
              name={coffee.name}
              description={coffee.description}
              price={formatPrice(coffee.price)}
              onOrder={() => handleOrderClick(coffee)}
            />
          ))}
        </div>
      </div>

      {selectedCoffee && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedCoffee(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {!isAuth ? (
              <>
                <div className={styles.loginPromptIcon}>☕</div>
                <h3 className={styles.modalTitle}>Authentication Required</h3>
                <p className={styles.modalSubtitle}>Please sign in to your Brew Haven account to place orders.</p>
                <div className={styles.modalActions}>
                  <Button variant="secondary" onClick={() => setSelectedCoffee(null)} className={styles.cancelBtn}>
                    Cancel
                  </Button>
                  <Button href="/login" className={styles.submitBtn}>
                    Go to Login
                  </Button>
                </div>
              </>
            ) : orderSuccess ? (
              <>
                <div className={styles.successIcon}>✓</div>
                <h3 className={styles.successTitle}>Order Placed!</h3>
                <p className={styles.modalSubtitle}>Your delicious {selectedCoffee.name} is being prepared.</p>
                <Button variant="secondary" onClick={() => setSelectedCoffee(null)} className={styles.cancelBtn}>
                  Done
                </Button>
              </>
            ) : (
              <form onSubmit={handleConfirmOrder}>
                <h3 className={styles.modalTitle}>Confirm Your Order</h3>
                <p className={styles.modalSubtitle}>Product: {selectedCoffee.name}</p>

                {orderError && <div className={styles.error}>{orderError}</div>}

                <div className={styles.formGroup}>
                  <label className={styles.label}>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className={styles.quantityInput}
                    required
                  />
                </div>

                <div className={styles.priceContainer}>
                  <span className={styles.priceLabel}>Total Price</span>
                  <span className={styles.priceValue}>
                    {formatPrice(parsePrice(selectedCoffee.price) * quantity)}
                  </span>
                </div>

                <div className={styles.modalActions}>
                  <Button variant="secondary" onClick={() => setSelectedCoffee(null)} className={styles.cancelBtn}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading} className={styles.submitBtn}>
                    {loading ? 'Processing...' : 'Place Order'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default Menu
