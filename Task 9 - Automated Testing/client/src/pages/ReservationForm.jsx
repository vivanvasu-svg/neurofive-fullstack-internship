import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Toast from '../components/Toast';
import styles from './ReservationForm.module.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TIME_SLOTS = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
    '08:00 PM', '09:00 PM',
];

const OCCASIONS = ['None', 'Birthday', 'Anniversary', 'Business Meeting', 'Date Night', 'Other'];

const INITIAL_FORM = {
    name: '',
    email: '',
    phone: '',
    date: '',
    timeSlot: '',
    guests: '',
    occasion: '',
    notes: '',
    photo: null,
};

// ── Client-side field validators ─────────────────────────────────────────────
function validateField(name, value) {
    switch (name) {
        case 'name':
            if (!value.trim()) return 'Full name is required.';
            if (value.trim().length < 2) return 'Name must be at least 2 characters.';
            if (value.trim().length > 80) return 'Name must not exceed 80 characters.';
            return '';
        case 'email':
            if (!value.trim()) return 'Email address is required.';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address.';
            return '';
        case 'phone':
            if (!value.trim()) return 'Phone number is required.';
            if (!/^\d{10}$/.test(value.trim())) return 'Phone number must be exactly 10 digits (no spaces or dashes).';
            return '';
        case 'date': {
            if (!value) return 'Please select a reservation date.';
            const chosen = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (chosen < today) return 'Reservation date must be today or in the future.';
            return '';
        }
        case 'timeSlot':
            if (!value) return 'Please select a time slot.';
            return '';
        case 'guests': {
            if (value === '' || value === null) return 'Number of guests is required.';
            const n = Number(value);
            if (!Number.isInteger(n) || n < 1) return 'At least 1 guest is required.';
            if (n > 20) return 'Maximum party size is 20.';
            return '';
        }
        case 'occasion':
            if (!value) return 'Please select an occasion.';
            return '';
        case 'notes':
            if (value.length > 300) return 'Special requests must not exceed 300 characters.';
            return '';
        case 'photo':
            if (value) {
                const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
                if (!allowed.includes(value.type)) return 'Only image files (JPEG, PNG, WebP, GIF) are accepted.';
                if (value.size > 2 * 1024 * 1024) return 'Image must be smaller than 2 MB.';
            }
            return '';
        default:
            return '';
    }
}

function validateAll(form) {
    const errors = {};
    Object.keys(INITIAL_FORM).forEach((key) => {
        const err = validateField(key, form[key] ?? '');
        if (err) errors[key] = err;
    });
    return errors;
}

// ── Component ─────────────────────────────────────────────────────────────────
function ReservationForm() {
    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [toast, setToast] = useState(null); // { message, type }
    const [photoPreview, setPhotoPreview] = useState(null);

    const todayISO = new Date().toISOString().split('T')[0];

    const showToast = (message, type) => {
        setToast({ message, type });
    };

    const dismissToast = useCallback(() => setToast(null), []);

    // ── Field change handler
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        const newValue = files ? files[0] : value;

        setForm((prev) => ({ ...prev, [name]: newValue }));

        // Generate image preview
        if (name === 'photo' && files && files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result);
            reader.readAsDataURL(files[0]);
        }

        // Validate on change if field already touched
        if (touched[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: validateField(name, newValue ?? ''),
            }));
        }
    };

    // ── Blur handler — mark field as touched
    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value),
        }));
    };

    // ── Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Mark all fields touched
        const allTouched = Object.keys(INITIAL_FORM).reduce((acc, k) => ({ ...acc, [k]: true }), {});
        setTouched(allTouched);

        const validationErrors = validateAll(form);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            // Scroll to first error
            const firstErr = document.querySelector(`.${styles.inputError}`);
            if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setSubmitting(true);

        try {
            const fd = new FormData();
            fd.append('name', form.name.trim());
            fd.append('email', form.email.trim());
            fd.append('phone', form.phone.trim());
            fd.append('date', form.date);
            fd.append('timeSlot', form.timeSlot);
            fd.append('guests', form.guests);
            fd.append('occasion', form.occasion);
            fd.append('notes', form.notes);
            if (form.photo) fd.append('photo', form.photo);

            const res = await fetch(`${API_BASE}/reservations`, {
                method: 'POST',
                body: fd,
            });

            const data = await res.json();

            if (!res.ok) {
                // Server returned field-level errors
                if (data.errors) {
                    setErrors(data.errors);
                }
                showToast(data.message || 'Reservation failed. Please fix the errors above.', 'error');
                return;
            }

            // ── Success
            setSubmitted(true);
            showToast('🎉 Your table has been reserved! We\'ll see you soon.', 'success');
            setForm(INITIAL_FORM);
            setTouched({});
            setErrors({});
            setPhotoPreview(null);
        } catch {
            showToast('Unable to reach the server. Please check your connection and try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const removePhoto = () => {
        setForm((prev) => ({ ...prev, photo: null }));
        setPhotoPreview(null);
        // reset file input
        const fileInput = document.getElementById('photo');
        if (fileInput) fileInput.value = '';
    };

    return (
        <div className={styles.page}>
            {/* ── Toast ── */}
            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={dismissToast} />
            )}

            {/* ── Header ── */}
            <header className={styles.header}>
                <Link to="/" className={styles.backLink}>
                    ← Back to Brew Haven
                </Link>
                <div className={styles.headerContent}>
                    <span className={styles.tagline}>Table Reservations</span>
                    <h1 className={styles.title}>Book Your Perfect Table</h1>
                    <p className={styles.subtitle}>
                        Reserve your spot at Brew Haven and enjoy a curated coffee experience crafted just for you.
                    </p>
                </div>
            </header>

            {/* ── Form Card ── */}
            <main className={styles.main}>
                <div className={styles.formCard}>
                    {submitted && (
                        <div className={styles.successBanner}>
                            <span className={styles.successIcon}>✓</span>
                            <div>
                                <strong>Reservation Received!</strong>
                                <p>We'll send a confirmation to your email shortly. Want to book another table?</p>
                                <button
                                    className={styles.bookAnotherBtn}
                                    onClick={() => setSubmitted(false)}
                                >
                                    Book Another Table
                                </button>
                            </div>
                        </div>
                    )}

                    {!submitted && (
                        <form
                            onSubmit={handleSubmit}
                            noValidate
                            className={styles.form}
                            aria-label="Table reservation form"
                        >
                            <div className={styles.formGrid}>
                                {/* ── Field 1: Full Name ── */}
                                <div className={`${styles.field} ${styles.fieldFull}`}>
                                    <label htmlFor="name" className={styles.label}>
                                        Full Name <span className={styles.required}>*</span>
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={form.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="e.g. Jane Doe"
                                        className={`${styles.input} ${errors.name && touched.name ? styles.inputError : ''}`}
                                        aria-describedby={errors.name ? 'name-error' : undefined}
                                        aria-invalid={!!errors.name && touched.name}
                                        disabled={submitting}
                                        autoComplete="name"
                                    />
                                    {errors.name && touched.name && (
                                        <p id="name-error" className={styles.errorMsg} role="alert">{errors.name}</p>
                                    )}
                                </div>

                                {/* ── Field 2: Email ── */}
                                <div className={styles.field}>
                                    <label htmlFor="email" className={styles.label}>
                                        Email Address <span className={styles.required}>*</span>
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="you@example.com"
                                        className={`${styles.input} ${errors.email && touched.email ? styles.inputError : ''}`}
                                        aria-describedby={errors.email ? 'email-error' : undefined}
                                        aria-invalid={!!errors.email && touched.email}
                                        disabled={submitting}
                                        autoComplete="email"
                                    />
                                    {errors.email && touched.email && (
                                        <p id="email-error" className={styles.errorMsg} role="alert">{errors.email}</p>
                                    )}
                                </div>

                                {/* ── Field 3: Phone ── */}
                                <div className={styles.field}>
                                    <label htmlFor="phone" className={styles.label}>
                                        Phone Number <span className={styles.required}>*</span>
                                    </label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={form.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="10-digit number"
                                        className={`${styles.input} ${errors.phone && touched.phone ? styles.inputError : ''}`}
                                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                                        aria-invalid={!!errors.phone && touched.phone}
                                        disabled={submitting}
                                        autoComplete="tel"
                                        maxLength={10}
                                    />
                                    {errors.phone && touched.phone && (
                                        <p id="phone-error" className={styles.errorMsg} role="alert">{errors.phone}</p>
                                    )}
                                </div>

                                {/* ── Field 4: Date ── */}
                                <div className={styles.field}>
                                    <label htmlFor="date" className={styles.label}>
                                        Reservation Date <span className={styles.required}>*</span>
                                    </label>
                                    <input
                                        id="date"
                                        name="date"
                                        type="date"
                                        value={form.date}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        min={todayISO}
                                        className={`${styles.input} ${errors.date && touched.date ? styles.inputError : ''}`}
                                        aria-describedby={errors.date ? 'date-error' : undefined}
                                        aria-invalid={!!errors.date && touched.date}
                                        disabled={submitting}
                                    />
                                    {errors.date && touched.date && (
                                        <p id="date-error" className={styles.errorMsg} role="alert">{errors.date}</p>
                                    )}
                                </div>

                                {/* ── Field 5: Time Slot (select/dropdown) ── */}
                                <div className={styles.field}>
                                    <label htmlFor="timeSlot" className={styles.label}>
                                        Preferred Time <span className={styles.required}>*</span>
                                    </label>
                                    <select
                                        id="timeSlot"
                                        name="timeSlot"
                                        value={form.timeSlot}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`${styles.input} ${styles.select} ${errors.timeSlot && touched.timeSlot ? styles.inputError : ''}`}
                                        aria-describedby={errors.timeSlot ? 'timeSlot-error' : undefined}
                                        aria-invalid={!!errors.timeSlot && touched.timeSlot}
                                        disabled={submitting}
                                    >
                                        <option value="">Select a time slot</option>
                                        {TIME_SLOTS.map((slot) => (
                                            <option key={slot} value={slot}>{slot}</option>
                                        ))}
                                    </select>
                                    {errors.timeSlot && touched.timeSlot && (
                                        <p id="timeSlot-error" className={styles.errorMsg} role="alert">{errors.timeSlot}</p>
                                    )}
                                </div>

                                {/* ── Field 6: Guests (number) ── */}
                                <div className={styles.field}>
                                    <label htmlFor="guests" className={styles.label}>
                                        Party Size <span className={styles.required}>*</span>
                                    </label>
                                    <input
                                        id="guests"
                                        name="guests"
                                        type="number"
                                        value={form.guests}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        min={1}
                                        max={20}
                                        placeholder="1 – 20"
                                        className={`${styles.input} ${errors.guests && touched.guests ? styles.inputError : ''}`}
                                        aria-describedby={errors.guests ? 'guests-error' : undefined}
                                        aria-invalid={!!errors.guests && touched.guests}
                                        disabled={submitting}
                                    />
                                    {errors.guests && touched.guests && (
                                        <p id="guests-error" className={styles.errorMsg} role="alert">{errors.guests}</p>
                                    )}
                                </div>

                                {/* ── Field 7: Occasion (select/dropdown) ── */}
                                <div className={styles.field}>
                                    <label htmlFor="occasion" className={styles.label}>
                                        Occasion <span className={styles.required}>*</span>
                                    </label>
                                    <select
                                        id="occasion"
                                        name="occasion"
                                        value={form.occasion}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`${styles.input} ${styles.select} ${errors.occasion && touched.occasion ? styles.inputError : ''}`}
                                        aria-describedby={errors.occasion ? 'occasion-error' : undefined}
                                        aria-invalid={!!errors.occasion && touched.occasion}
                                        disabled={submitting}
                                    >
                                        <option value="">Select occasion</option>
                                        {OCCASIONS.map((o) => (
                                            <option key={o} value={o}>{o}</option>
                                        ))}
                                    </select>
                                    {errors.occasion && touched.occasion && (
                                        <p id="occasion-error" className={styles.errorMsg} role="alert">{errors.occasion}</p>
                                    )}
                                </div>

                                {/* ── Field 8: Special Requests (textarea) ── */}
                                <div className={`${styles.field} ${styles.fieldFull}`}>
                                    <label htmlFor="notes" className={styles.label}>
                                        Special Requests
                                        <span className={styles.charCount}>
                                            {form.notes.length}/300
                                        </span>
                                    </label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={form.notes}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        rows={3}
                                        placeholder="Dietary requirements, seating preferences, surprise setup…"
                                        className={`${styles.input} ${styles.textarea} ${errors.notes && touched.notes ? styles.inputError : ''}`}
                                        aria-describedby={errors.notes ? 'notes-error' : undefined}
                                        aria-invalid={!!errors.notes && touched.notes}
                                        disabled={submitting}
                                        maxLength={300}
                                    />
                                    {errors.notes && touched.notes && (
                                        <p id="notes-error" className={styles.errorMsg} role="alert">{errors.notes}</p>
                                    )}
                                </div>

                                {/* ── Field 9: Photo / File Upload ── */}
                                <div className={`${styles.field} ${styles.fieldFull}`}>
                                    <label htmlFor="photo" className={styles.label}>
                                        Event Photo
                                        <span className={styles.optional}>(optional · JPEG/PNG/WebP · max 2 MB)</span>
                                    </label>

                                    {photoPreview ? (
                                        <div className={styles.previewWrapper}>
                                            <img src={photoPreview} alt="Preview of uploaded event photo" className={styles.preview} />
                                            <button
                                                type="button"
                                                className={styles.removePhoto}
                                                onClick={removePhoto}
                                                disabled={submitting}
                                            >
                                                Remove photo
                                            </button>
                                        </div>
                                    ) : (
                                        <label htmlFor="photo" className={`${styles.fileLabel} ${errors.photo && touched.photo ? styles.inputError : ''}`}>
                                            <span className={styles.fileIcon}>📷</span>
                                            <span>Click to upload or drag &amp; drop</span>
                                            <input
                                                id="photo"
                                                name="photo"
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp,image/gif"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={styles.fileInput}
                                                disabled={submitting}
                                                aria-describedby={errors.photo ? 'photo-error' : undefined}
                                            />
                                        </label>
                                    )}

                                    {errors.photo && touched.photo && (
                                        <p id="photo-error" className={styles.errorMsg} role="alert">{errors.photo}</p>
                                    )}
                                </div>
                            </div>

                            {/* ── Submit Button ── */}
                            <div className={styles.actions}>
                                <button
                                    type="submit"
                                    className={styles.submitBtn}
                                    disabled={submitting}
                                    aria-busy={submitting}
                                    id="submit-reservation"
                                >
                                    {submitting ? (
                                        <span className={styles.loadingInner}>
                                            <span className={styles.spinner} aria-hidden="true" />
                                            Booking your table…
                                        </span>
                                    ) : (
                                        'Book My Table'
                                    )}
                                </button>
                                <p className={styles.formNote}>
                                    All fields marked <span className={styles.required}>*</span> are required.
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}

export default ReservationForm;
