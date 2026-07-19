import { GiCoffeeBeans } from 'react-icons/gi'
import { FaBolt, FaMugHot } from 'react-icons/fa'
import SectionTitle from '../components/SectionTitle'
import FeatureCard from '../components/FeatureCard'
import styles from './Features.module.css'

const FEATURES = [
  {
    icon: GiCoffeeBeans,
    title: 'Fresh Beans',
    description: 'Imported premium coffee beans, roasted in small batches for maximum flavor.',
  },
  {
    icon: FaBolt,
    title: 'Fast Service',
    description: 'Prepared in minutes by our expert baristas, without cutting any corners.',
  },
  {
    icon: FaMugHot,
    title: 'Cozy Atmosphere',
    description: 'The perfect place to relax, catch up with friends, or get some work done.',
  },
]

function Features() {
  return (
    <section className="section">
      <div className="container">
        <SectionTitle
          eyebrow="Why Brew Haven"
          title="Everything you need in a cup"
          description="From bean to brew, we obsess over the details so you don't have to."
        />
        <div className={styles.grid}>
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
