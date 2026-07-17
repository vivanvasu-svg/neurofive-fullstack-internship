import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCoffee, FaArrowLeft, FaGift } from 'react-icons/fa';
import api from '../services/api';
import CoffeeForm from '../components/CoffeeForm';
import AdminCoffeeCard from '../components/AdminCoffeeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import styles from './Admin.module.css';

function Admin() {
    const [coffees, setCoffees] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'orders'
    const [loading, setLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Loading coffees...');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [editingItem, setEditingItem] = useState(null);

    const navigate = useNavigate();

    const handleLogout = () => {
        api.logout();
        navigate('/login');
    };

    // Fetch coffees or orders depending on active tab
    useEffect(() => {
        if (activeTab === 'menu') {
            fetchCoffees();
        } else {
            fetchOrders();
        }
    }, [activeTab]);

    const fetchCoffees = async () => {
        setLoading(true);
        setLoadingMessage('Loading coffees...');
        setError(null);
        try {
            const data = await api.getCoffees();
            setCoffees(data);
        } catch (err) {
            console.error(err);
            setError('Unable to connect to the server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        setOrdersLoading(true);
        setError(null);
        try {
            const data = await api.getOrders();
            setOrders(data);
        } catch (err) {
            console.error(err);
            setError('Unable to fetch customer orders.');
        } finally {
            setOrdersLoading(false);
        }
    };

    const handleFormSubmit = async (formData) => {
        setSubmitting(true);
        setError(null);
        if (editingItem) {
            // Editing Mode -> PUT Request
            setLoadingMessage('Saving changes...');
            try {
                const updated = await api.updateCoffee(editingItem.id, formData);
                setCoffees((prev) =>
                    prev.map((c) => (c.id === editingItem.id ? updated : c))
                );
                setEditingItem(null); // Clear edit state
            } catch (err) {
                console.error(err);
                setError('Failed to update coffee item. Please try again.');
            } finally {
                setSubmitting(false);
            }
        } else {
            // Adding Mode -> POST Request
            setLoadingMessage('Adding coffee...');
            try {
                const created = await api.createCoffee(formData);
                setCoffees((prev) => [created, ...prev]);
            } catch (err) {
                console.error(err);
                setError('Failed to add coffee item. Please try again.');
            } finally {
                setSubmitting(false);
            }
        }
    };

    const handleEditClick = (coffee) => {
        setEditingItem(coffee);
        // Scroll form into view on mobile
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = async (id) => {
        const coffeeToDelete = coffees.find((c) => c.id === id);
        if (!coffeeToDelete) return;

        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${coffeeToDelete.name}"?`
        );
        if (!confirmDelete) return;

        setSubmitting(true);
        setError(null);
        setLoadingMessage('Deleting coffee...');
        try {
            await api.deleteCoffee(id);
            setCoffees((prev) => prev.filter((c) => c.id !== id));
            if (editingItem && editingItem.id === id) {
                setEditingItem(null); // Clear editing if deleted
            }
        } catch (err) {
            console.error(err);
            setError('Failed to delete coffee item. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateOrderStatus = async (id, status) => {
        setSubmitting(true);
        setError(null);
        setLoadingMessage('Updating status...');
        try {
            await api.updateOrderStatus(id, status);
            setOrders((prev) =>
                prev.map((o) => (o._id === id ? { ...o, status } : o))
            );
        } catch (err) {
            console.error(err);
            setError('Failed to update order status. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
    };

    return (
        <div className={styles.adminPage}>
            {/* Admin Navbar */}
            <header className={styles.navbar}>
                <div className={styles.navbarContainer}>
                    <div className={styles.logoGroup}>
                        <FaCoffee className={styles.logoIcon} />
                        <span className={styles.logoText}>Brew Haven</span>
                        <span className={styles.badge}>Admin</span>
                    </div>
                    <div className={styles.navActions}>
                        <Link to="/" className={styles.backLink}>
                            <FaArrowLeft /> Back to Website
                        </Link>
                        <button onClick={handleLogout} className={styles.logoutBtn} aria-label="Logout">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Admin Section */}
            <main className={styles.main}>
                <div className={styles.header}>
                    <h2 className={styles.pageTitle}>Admin Management Dashboard</h2>
                    <p className={styles.pageSubtitle}>
                        Control menu offerings, view customer purchases, and track order completion status.
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className={styles.tabContainer}>
                    <button
                        onClick={() => setActiveTab('menu')}
                        className={`${styles.tabBtn} ${activeTab === 'menu' ? styles.activeTabBtn : ''}`}
                    >
                        Menu Items
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`${styles.tabBtn} ${activeTab === 'orders' ? styles.activeTabBtn : ''}`}
                    >
                        Customer Orders
                    </button>
                </div>

                {/* Global Action Feedbacks */}
                {error && <ErrorMessage message={error} />}
                {(submitting) && (
                    <div className={styles.globalSpinner}>
                        <LoadingSpinner message={loadingMessage} />
                    </div>
                )}

                {/* Tab: Menu Management */}
                {activeTab === 'menu' && (
                    <div className={styles.grid}>
                        {/* Left Column - Form */}
                        <div className={styles.formColumn}>
                            <CoffeeForm
                                initialData={editingItem}
                                onSubmit={handleFormSubmit}
                                loading={submitting || loading}
                                onCancel={handleCancelEdit}
                            />
                        </div>

                        {/* Right Column - Coffee List */}
                        <div className={styles.listColumn}>
                            <div className={styles.listHeader}>
                                <h3 className={styles.listTitle}>
                                    Active Menu Items ({coffees.length})
                                </h3>
                                <button
                                    onClick={fetchCoffees}
                                    className={styles.refreshBtn}
                                    disabled={loading || submitting}
                                >
                                    Refresh List
                                </button>
                            </div>

                            {loading ? (
                                <LoadingSpinner message="Loading coffees..." />
                            ) : coffees.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <FaCoffee className={styles.emptyIcon} />
                                    <p>No coffee menu items found.</p>
                                    <p className={styles.emptySub}>Use the form on the left to add your first menu item.</p>
                                </div>
                            ) : (
                                <div className={styles.cardGrid}>
                                    {coffees.map((coffee) => (
                                        <AdminCoffeeCard
                                            key={coffee.id}
                                            coffee={coffee}
                                            onEdit={handleEditClick}
                                            onDelete={handleDeleteClick}
                                            disabled={loading || submitting}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Tab: Customer Orders */}
                {activeTab === 'orders' && (
                    <div className={styles.ordersSection}>
                        <div className={styles.listHeader}>
                            <h3 className={styles.listTitle}>Received Orders ({orders.length})</h3>
                            <button onClick={fetchOrders} className={styles.refreshBtn} disabled={ordersLoading}>
                                Refresh Orders
                            </button>
                        </div>
                        {ordersLoading ? (
                            <LoadingSpinner message="Fetching customer orders..." />
                        ) : orders.length === 0 ? (
                            <div className={styles.emptyState}>
                                <FaGift className={styles.emptyIcon} />
                                <p>No customer orders placed yet.</p>
                                <p className={styles.emptySub}>Customer purchases will appear here in real-time.</p>
                            </div>
                        ) : (
                            <div className={styles.ordersTableContainer}>
                                <table className={styles.ordersTable}>
                                    <thead>
                                        <tr>
                                            <th>Customer</th>
                                            <th>Coffee Selection</th>
                                            <th>Quantity</th>
                                            <th>Total Price</th>
                                            <th>Order Time & Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order._id}>
                                                <td>{order.username}</td>
                                                <td>{order.coffeeName}</td>
                                                <td>{order.quantity}</td>
                                                <td>${order.totalPrice.toFixed(2)}</td>
                                                <td>{new Date(order.createdAt).toLocaleString()}</td>
                                                <td>
                                                    <span className={`${styles.statusBadge} ${order.status === 'completed' ? styles.statusCompleted : styles.statusPending}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {order.status === 'pending' ? (
                                                        <button
                                                            onClick={() => handleUpdateOrderStatus(order._id, 'completed')}
                                                            className={styles.completeBtn}
                                                            disabled={submitting}
                                                        >
                                                            Mark Completed
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleUpdateOrderStatus(order._id, 'pending')}
                                                            className={styles.pendingBtn}
                                                            disabled={submitting}
                                                        >
                                                            Restore Pending
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Admin;
