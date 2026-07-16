import SectionTitle from '../components/SectionTitle'
import TestimonialCard from '../components/TestimonialCard'
import styles from './Testimonials.module.css'

const TESTIMONIALS = [
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
  return (
    <section id="reviews" className="section">
      <div className="container">
        <SectionTitle
          eyebrow="Testimonials"
          title="Loved by our customers"
          description="Don't just take our word for it — here's what coffee lovers are saying."
        />
        <div className={styles.grid}>
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
