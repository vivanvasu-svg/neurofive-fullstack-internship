import Reservation from '../models/Reservation.js';

const TIME_SLOTS = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
    '08:00 PM', '09:00 PM',
];

const OCCASIONS = ['None', 'Birthday', 'Anniversary', 'Business Meeting', 'Date Night', 'Other'];

// Helper: validate all fields and return an errors object
function validateReservation({ name, email, phone, date, timeSlot, guests, occasion, notes }) {
    const errors = {};

    // Name
    if (!name || name.trim().length < 2) {
        errors.name = 'Full name must be at least 2 characters.';
    } else if (name.trim().length > 80) {
        errors.name = 'Full name must not exceed 80 characters.';
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.email = 'Please enter a valid email address.';
    }

    // Phone
    const phoneRegex = /^\d{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
        errors.phone = 'Phone number must be exactly 10 digits.';
    }

    // Date — must be present and in the future (allow today)
    if (!date) {
        errors.date = 'Please select a reservation date.';
    } else {
        const chosen = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (isNaN(chosen.getTime())) {
            errors.date = 'Invalid date format.';
        } else if (chosen < today) {
            errors.date = 'Reservation date must be today or in the future.';
        }
    }

    // Time slot
    if (!timeSlot || !TIME_SLOTS.includes(timeSlot)) {
        errors.timeSlot = 'Please select a valid time slot.';
    }

    // Guests
    const guestNum = Number(guests);
    if (!guests || isNaN(guestNum)) {
        errors.guests = 'Number of guests is required.';
    } else if (guestNum < 1) {
        errors.guests = 'At least 1 guest is required.';
    } else if (guestNum > 20) {
        errors.guests = 'Maximum party size is 20.';
    }

    // Occasion
    if (!occasion || !OCCASIONS.includes(occasion)) {
        errors.occasion = 'Please select a valid occasion.';
    }

    // Notes (optional)
    if (notes && notes.length > 300) {
        errors.notes = 'Special requests must not exceed 300 characters.';
    }

    return errors;
}

// @desc    Create a new table reservation
// @route   POST /api/reservations
// @access  Public
export const createReservation = async (req, res) => {
    try {
        const { name, email, phone, date, timeSlot, guests, occasion, notes } = req.body;
        const photoPath = req.file ? req.file.path : '';

        // Server-side validation
        const errors = validateReservation({ name, email, phone, date, timeSlot, guests, occasion, notes });
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ message: 'Validation failed', errors });
        }

        const reservation = new Reservation({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            date: new Date(date),
            timeSlot,
            guests: Number(guests),
            occasion,
            notes: notes ? notes.trim() : '',
            photoPath,
        });

        const saved = await reservation.save();
        res.status(201).json({
            message: 'Reservation created successfully!',
            reservation: saved,
        });
    } catch (error) {
        console.error('Reservation error:', error.message);
        res.status(500).json({ message: 'Server error while creating reservation. Please try again.' });
    }
};

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private (Admin)
export const getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({}).sort({ createdAt: -1 });
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving reservations', error: error.message });
    }
};

// @desc    Update reservation status
// @route   PUT /api/reservations/:id
// @access  Private (Admin)
export const updateReservationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Valid status (pending, confirmed, cancelled) is required' });
        }

        const reservation = await Reservation.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ message: 'Error updating reservation', error: error.message });
    }
};
