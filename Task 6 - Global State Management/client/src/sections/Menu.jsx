import { useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import CoffeeCard from '../components/CoffeeCard'
import SkeletonCard from '../components/SkeletonCard'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'
import { useCoffees } from '../context/CoffeeContext'
import api from '../services/api'
import styles from './Menu.module.css'

const SKELETON_COUNT = 8;

function Menu() {
  const { isAuth } = useAuth()
  const { coffees, loading } = useCoffees()

  const [selectedCoffee, setSelectedCoffee] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)
  const [orderError, setOrderError] = useState('')

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
      window.location.href = '/login'
      return
    }
    if (quantity < 1) {
      setOrderError('Quantity must be at least 1')
      return
    }
    setOrderLoading(true)
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
      setOrderLoading(false)
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

        {/* ── Skeleton state ── */}
        {loading && (
          <div className={styles.grid}>
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <SkeletonCard key={i} variant="coffee" />
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && coffees.length === 0 && (
          <EmptyState
            icon="☕"
            title="Menu is brewing…"
            description="We couldn't load the menu right now. Please check back in a moment."
            action={
              <Button href="#menu" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            }
          />
        )}

        {/* ── Loaded state ── */}
        {!loading && coffees.length > 0 && (
          <div className={styles.grid}>
            {coffees.map((coffee) => (
              <CoffeeCard
                key={coffee._id || coffee.id || coffee.name}
                image={coffee.image}
                name={coffee.name}
                description={coffee.description}
                price={formatPrice(coffee.price)}
                onOrder={() => handleOrderClick(coffee)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Order Modal ── */}
      {selectedCoffee && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedCoffee(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {!isAuth ? (
              <>
                <div className={styles.loginPromptIcon}>☕</div>
                <h3 className={styles.modalTitle}>Authentication Required</h3>
                <p className={styles.modalSubtitle}>Please sign in to place orders.</p>
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
                  <Button type="submit" disabled={orderLoading} className={styles.submitBtn}>
                    {orderLoading ? 'Processing…' : 'Place Order'}
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
