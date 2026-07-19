import React, { useState, useEffect } from 'react'
import SectionTitle from '../components/SectionTitle'
import styles from './Mixology.module.css'

const QUICK_FILTERS = [
    { label: 'Coffee Cocktails', query: 'coffee' },
    { label: 'Espresso Martinis', query: 'martini' },
    { label: 'Irish Coffees', query: 'irish' },
    { label: 'Bar Liqueurs', query: 'liqueur' },
]

function Mixology() {
    const [searchTerm, setSearchTerm] = useState('coffee')
    const [activeQuery, setActiveQuery] = useState('coffee')
    const [drinks, setDrinks] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchDrinks = async (query) => {
        if (!query.trim()) return

        setLoading(true)
        setError(null)
        setDrinks([])

        try {
            const response = await fetch(
                `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query.trim())}`
            )

            if (!response.ok) {
                throw new Error('API server error. Please try again.')
            }

            const data = await response.json()

            if (data && data.drinks) {
                setDrinks(data.drinks)
            } else {
                throw new Error(`No specialty drinks found matching "${query}". Try searching for 'coffee' or 'martini'.`)
            }
        } catch (err) {
            setError(err.message || 'Something went wrong while connecting to the mixology DB.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDrinks('coffee')
    }, [])

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        setActiveQuery(null)
        fetchDrinks(searchTerm)
    }

    const handleQuickFilterClick = (filter) => {
        setSearchTerm(filter.query)
        setActiveQuery(filter.query)
        fetchDrinks(filter.query)
    }

    const getIngredientsList = (drink) => {
        const list = []
        for (let i = 1; i <= 15; i++) {
            const ingredient = drink[`strIngredient${i}`]
            const measure = drink[`strMeasure${i}`]
            if (ingredient && ingredient.trim()) {
                list.push({
                    name: ingredient,
                    measure: measure ? measure.trim() : '',
                })
            }
        }
        return list
    }

    return (
        <section id="mixology" className="section">
            <div className="container">
                <SectionTitle
                    eyebrow="Signature Blends"
                    title="Signature Mixology & Coffee Cocktails"
                    description="Explore our curated coffee-based mocktails, liqueurs, and cocktails fetched in real-time from TheCocktailDB."
                />

                <div className={styles.explorerWrapper}>
                    <div className={styles.controls}>
                        <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
                            <input
                                type="text"
                                placeholder="Search coffee drinks (e.g. Irish Coffee, Espresso Martini)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                            <button type="submit" className={styles.searchBtn}>
                                Search
                            </button>
                        </form>

                        <div className={styles.filterWrapper}>
                            <span className={styles.filterLabel}>Special Barista Picks:</span>
                            <div className={styles.chips}>
                                {QUICK_FILTERS.map((f) => (
                                    <button
                                        key={f.query}
                                        type="button"
                                        onClick={() => handleQuickFilterClick(f)}
                                        className={`${styles.chip} ${activeQuery === f.query ? styles.chipActive : ''}`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles.resultsArea}>
                        {loading && (
                            <div className={styles.loadingState}>
                                <div className={styles.spinner}></div>
                                <p>Loading curated recipes from TheCocktailDB...</p>
                            </div>
                        )}

                        {error && (
                            <div className={styles.errorState}>
                                <div className={styles.errorBox}>
                                    <p className={styles.errorMessage}>{error}</p>
                                    <button
                                        onClick={() => {
                                            setSearchTerm('coffee')
                                            setActiveQuery('coffee')
                                            fetchDrinks('coffee')
                                        }}
                                        className={styles.resetBtn}
                                    >
                                        Reset Sourcing to Coffee Recipes
                                    </button>
                                </div>
                            </div>
                        )}

                        {!loading && !error && drinks.length > 0 && (
                            <div className={styles.drinksGrid}>
                                {drinks.map((drink) => (
                                    <div key={drink.idDrink} className={styles.drinkCard}>
                                        <div className={styles.imageWrapper}>
                                            <img
                                                src={drink.strDrinkThumb}
                                                alt={drink.strDrink}
                                                className={styles.drinkImage}
                                                loading="lazy"
                                            />
                                            <span className={styles.tagClass}>
                                                {drink.strAlcoholic}
                                            </span>
                                        </div>

                                        <div className={styles.details}>
                                            <span className={styles.category}>{drink.strCategory}</span>
                                            <h3 className={styles.drinkName}>{drink.strDrink}</h3>

                                            <div className={styles.ingredientsBox}>
                                                <h4 className={styles.subSubtitle}>Ingredients:</h4>
                                                <ul className={styles.ingredientsList}>
                                                    {getIngredientsList(drink).map((ing, index) => (
                                                        <li key={index} className={styles.ingredientItem}>
                                                            <span className={styles.ingMeasure}>{ing.measure}</span>{' '}
                                                            <span className={styles.ingName}>{ing.name}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className={styles.instructionsBox}>
                                                <h4 className={styles.subSubtitle}>Instructions:</h4>
                                                <p className={styles.instructionsText}>{drink.strInstructions}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Mixology
