import SectionTitle from '../components/SectionTitle'
import CoffeeCard from '../components/CoffeeCard'
import styles from './Menu.module.css'

const COFFEES = [
  {
    name: 'Espresso',
    description: 'A bold, concentrated shot with a rich crema and intense aroma.',
    price: '$3.50',
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Cappuccino',
    description: 'Espresso topped with steamed milk and a thick layer of velvety foam.',
    price: '$4.25',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Latte',
    description: 'Smooth espresso balanced with steamed milk and light, silky foam.',
    price: '$4.50',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Mocha',
    description: 'Espresso and steamed milk swirled with rich, decadent chocolate.',
    price: '$4.75',
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Cold Brew',
    description: 'Steeped slowly in cold water for 24 hours, delivering an ultra-smooth, naturally sweet flavor.',
    price: '$4.50',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Macchiato',
    description: 'Bold espresso marked with a small dollop of creamy, aerated foam.',
    price: '$3.75',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Affogato',
    description: 'A decadent scoop of creamy vanilla bean gelato drowned in a hot shot of espresso.',
    price: '$5.50',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Flat White',
    description: 'Double shot of rich espresso topped with smooth micro-foamed milk for a velvety finish.',
    price: '$4.25',
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80',
  },
]

function Menu() {
  return (
    <section id="menu" className="section section--muted">
      <div className="container">
        <SectionTitle
          eyebrow="Popular Picks"
          title="Our Coffee Menu"
          description="Handcrafted classics, made fresh to order every single time."
        />
        <div className={styles.grid}>
          {COFFEES.map((coffee) => (
            <CoffeeCard key={coffee.name} {...coffee} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Menu
