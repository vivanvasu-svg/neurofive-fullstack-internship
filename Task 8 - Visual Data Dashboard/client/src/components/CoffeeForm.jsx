import { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import styles from './CoffeeForm.module.css';

const CATEGORIES = ['Hot Coffee', 'Cold Coffee', 'Specialty Brew', 'Dessert Coffee', 'Mixology Special'];

function CoffeeForm({ initialData = null, onSubmit, loading, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: CATEGORIES[0],
        image: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                price: initialData.price || '',
                category: initialData.category || CATEGORIES[0],
                image: initialData.image || '',
            });
        } else {
            setFormData({
                name: '',
                description: '',
                price: '',
                category: CATEGORIES[0],
                image: '',
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validations
        if (!formData.name.trim()) return;
        if (!formData.description.trim()) return;
        if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) < 0) return;
        if (!formData.image.trim()) return;

        onSubmit({
            ...formData,
            price: parseFloat(formData.price),
        });
    };

    const isEditing = !!initialData;

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h3 className={styles.title}>{isEditing ? 'Edit Coffee Item' : 'Add New Coffee'}</h3>

            <div className={styles.field}>
                <label htmlFor="name" className={styles.label}>Coffee Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className={styles.input}
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="e.g. Mocha Premium"
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="description" className={styles.label}>Description</label>
                <textarea
                    id="description"
                    name="description"
                    className={styles.textarea}
                    value={formData.description}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="Describe the coffee blend and milk texture..."
                />
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label htmlFor="price" className={styles.label}>Price ($)</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        step="0.01"
                        min="0"
                        className={styles.input}
                        value={formData.price}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        placeholder="5.99"
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="category" className={styles.label}>Category</label>
                    <select
                        id="category"
                        name="category"
                        className={styles.select}
                        value={formData.category}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Coffee Image</label>
                {!formData.image ? (
                    <>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <select
                                className={styles.select}
                                style={{ flex: 1 }}
                                disabled={loading}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        setFormData((prev) => ({ ...prev, image: e.target.value }));
                                    }
                                }}
                                defaultValue=""
                            >
                                <option value="" disabled>⬇ Or select a suggested default image…</option>
                                <option value="https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800">Espresso shot</option>
                                <option value="https://images.pexels.com/photos/350584/pexels-photo-350584.jpeg?auto=compress&cs=tinysrgb&w=800">Cappuccino</option>
                                <option value="https://images.pexels.com/photos/3953477/pexels-photo-3953477.jpeg?auto=compress&cs=tinysrgb&w=800">Latte art</option>
                                <option value="https://images.pexels.com/photos/1570779/pexels-photo-1570779.jpeg?auto=compress&cs=tinysrgb&w=800">Mocha</option>
                                <option value="https://images.pexels.com/photos/2638019/pexels-photo-2638019.jpeg?auto=compress&cs=tinysrgb&w=800">Cold Brew</option>
                                <option value="https://images.pexels.com/photos/4108774/pexels-photo-4108774.jpeg?auto=compress&cs=tinysrgb&w=800">Macchiato</option>
                                <option value="https://images.pexels.com/photos/6205590/pexels-photo-6205590.jpeg?auto=compress&cs=tinysrgb&w=800">Affogato</option>
                                <option value="https://images.pexels.com/photos/5946971/pexels-photo-5946971.jpeg?auto=compress&cs=tinysrgb&w=800">Flat White</option>
                                <option value="https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=800">Iced Coffee</option>
                                <option value="https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800">Coffee beans</option>
                            </select>
                        </div>
                        <ImageUpload
                            value={formData.image}
                            onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                            disabled={loading}
                        />
                    </>
                ) : (
                    <ImageUpload
                        value={formData.image}
                        onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                        disabled={loading}
                    />
                )}
            </div>

            <div className={styles.actions}>
                {isEditing && (
                    <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={loading}
                >
                    {loading ? (isEditing ? 'Saving changes...' : 'Adding coffee...') : (isEditing ? 'Save Changes' : 'Add Coffee')}
                </button>
            </div>
        </form>
    );
}

export default CoffeeForm;
