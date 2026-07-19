import { useEffect, useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import TestimonialCard from '../components/TestimonialCard'
import SkeletonCard from '../components/SkeletonCard'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import styles from './Testimonials.module.css'

const STATIC_TESTIMONIALS = [
  {
    quote: 'The best latte I have had in the city. The atmosphere makes it easy to stay for hours.',
    name: 'Amara Chen',
    role: 'Regular Customer',
  },
  {
    quote: 'Fast, friendly, and the espresso is always consistent. My go-to spot before work.',
    name: 'Daniel Osei',
    role: 'Software Engineer',
  },
  {
    quote: 'Cozy, quiet, and the mocha is incredible. It genuinely feels like a home away from home.',
    name: 'Priya Sharma',
    role: 'Freelance Writer',
  },
]

function Testimonials() {
  const { isAuth } = useAuth()
  const [reviews, setReviews] = useState([])
  const [fetchLoading, setFetchLoading] = useState(true)
  const [newReview, setNewReview] = useState('')
  const [newRating, setNewRating] = useState(5)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchReviews = async () => {
    setFetchLoading(true)
    try {
      const data = await api.getReviews()
      if (data && data.length > 0) {
        setReviews(data.map(r => ({
          quote: r.quote,
          name: r.username,
          role: 'Verified Customer',
        })))
      } else {
        setReviews(STATIC_TESTIMONIALS)
      }
    } catch (err) {
      console.error('Error fetching reviews:', err)
      setReviews(STATIC_TESTIMONIALS)
    } finally {
      setFetchLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!newReview.trim()) {
      setError('Please enter a review message.')
      return
    }
    setSubmitLoading(true)
    setError('')
    try {
      await api.createReview({ quote: newReview.trim(), rating: Number(newRating) })
      setNewReview('')
      setNewRating(5)
      fetchReviews()
    } catch (err) {
      console.error(err)
      setError('Failed to post review. Please try again.')
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <section id="reviews" className="section">
      <div className="container">
        <SectionTitle
          eyebrow="Testimonials"
          title="Loved by our customers"
          description="Don't just take our word for it — here's what coffee lovers are saying."
        />

        {/* ── Skeleton state ── */}
        {fetchLoading && (
          <div className={styles.grid}>
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} variant="testimonial" />
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!fetchLoading && reviews.length === 0 && (
          <EmptyState
            icon="💬"
            title="No reviews yet"
            description="Be the first to share your Brew Haven experience!"
          />
        )}

        {/* ── Loaded state ── */}
        {!fetchLoading && reviews.length > 0 && (
          <div className={styles.grid}>
            {reviews.map((testimonial, idx) => (
              <TestimonialCard key={testimonial.name + '-' + idx} {...testimonial} />
            ))}
          </div>
        )}

        {/* ── Review form (auth-gated) ── */}
        {isAuth ? (
          <div className={styles.reviewFormContainer}>
            <h3 className={styles.formTitle}>Share Your Brew Experience</h3>
            {error && <div className={styles.error}>{error}</div>}
            <form onSubmit={handleSubmitReview} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Your Review</label>
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  className={styles.textarea}
                  placeholder="Tell us what you think..."
                  required
                />
              </div>
              <div className={styles.formInline}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Rating</label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(e.target.value)}
                    className={styles.select}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                    <option value={3}>⭐⭐⭐ (3/5)</option>
                    <option value={2}>⭐⭐ (2/5)</option>
                    <option value={1}>⭐ (1/5)</option>
                  </select>
                </div>
                <Button type="submit" disabled={submitLoading} className={styles.submitBtn}>
                  {submitLoading ? 'Posting…' : 'Post Review'}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className={styles.loginMsg}>
            <p>
              Loved your coffee? <a href="/login" className={styles.loginLink}>Login</a> to share your review!
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Testimonials
