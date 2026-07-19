import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const STATIC_COFFEES = [
    {
        id: 'static-1',
        name: 'Espresso',
        description: 'A bold, concentrated shot with a rich crema and intense aroma.',
        price: 3.50,
        image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
        id: 'static-2',
        name: 'Cappuccino',
        description: 'Espresso topped with steamed milk and a thick layer of velvety foam.',
        price: 4.25,
        image: 'https://images.pexels.com/photos/350584/pexels-photo-350584.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
        id: 'static-3',
        name: 'Latte',
        description: 'Smooth espresso balanced with steamed milk and light, silky foam.',
        price: 4.50,
        image: 'https://images.pexels.com/photos/3953477/pexels-photo-3953477.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
        id: 'static-4',
        name: 'Mocha',
        description: 'Espresso and steamed milk swirled with rich, decadent chocolate.',
        price: 4.75,
        image: 'https://images.pexels.com/photos/1570779/pexels-photo-1570779.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
        id: 'static-5',
        name: 'Cold Brew',
        description: 'Steeped slowly in cold water for 24 hours, ultra-smooth and naturally sweet.',
        price: 4.50,
        image: 'https://images.pexels.com/photos/2638019/pexels-photo-2638019.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
        id: 'static-6',
        name: 'Macchiato',
        description: 'Bold espresso marked with a small dollop of creamy, aerated foam.',
        price: 3.75,
        image: 'https://images.pexels.com/photos/4108774/pexels-photo-4108774.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
        id: 'static-7',
        name: 'Affogato',
        description: 'A decadent scoop of vanilla bean gelato drowned in a hot shot of espresso.',
        price: 5.50,
        image: 'https://images.pexels.com/photos/6205590/pexels-photo-6205590.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
        id: 'static-8',
        name: 'Flat White',
        description: 'Double shot of rich espresso topped with smooth micro-foamed milk.',
        price: 4.25,
        image: 'https://images.pexels.com/photos/5946971/pexels-photo-5946971.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
];

const CoffeeContext = createContext(null);

export function CoffeeProvider({ children }) {
    const [coffees, setCoffees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCoffees = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getCoffees();
            setCoffees(data && data.length > 0 ? data : STATIC_COFFEES);
        } catch (err) {
            console.error('CoffeeContext fetch error:', err);
            setCoffees(STATIC_COFFEES);
            setError('Could not load live menu — showing default items.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCoffees();
    }, [fetchCoffees]);

    const addCoffee = useCallback((coffee) => {
        setCoffees((prev) => [coffee, ...prev]);
    }, []);

    const updateCoffee = useCallback((id, updated) => {
        setCoffees((prev) => prev.map((c) => (c.id === id ? updated : c)));
    }, []);

    const removeCoffee = useCallback((id) => {
        setCoffees((prev) => prev.filter((c) => c.id !== id));
    }, []);

    return (
        <CoffeeContext.Provider value={{ coffees, loading, error, fetchCoffees, addCoffee, updateCoffee, removeCoffee }}>
            {children}
        </CoffeeContext.Provider>
    );
}

export function useCoffees() {
    const ctx = useContext(CoffeeContext);
    if (!ctx) throw new Error('useCoffees must be used inside <CoffeeProvider>');
    return ctx;
}

export default CoffeeContext;
