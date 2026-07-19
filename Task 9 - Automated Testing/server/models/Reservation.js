import mongoose from 'mongoose';

const TIME_SLOTS = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
    '08:00 PM', '09:00 PM',
];

const OCCASIONS = ['None', 'Birthday', 'Anniversary', 'Business Meeting', 'Date Night', 'Other'];

const reservationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Full name is required'],
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [80, 'Name cannot exceed 80 characters'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email address is required'],
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
        },
        date: {
            type: Date,
            required: [true, 'Reservation date is required'],
        },
        timeSlot: {
            type: String,
            required: [true, 'Please select a time slot'],
            enum: { values: TIME_SLOTS, message: 'Invalid time slot selected' },
        },
        guests: {
            type: Number,
            required: [true, 'Number of guests is required'],
            min: [1, 'At least 1 guest is required'],
            max: [20, 'Maximum party size is 20'],
        },
        occasion: {
            type: String,
            required: [true, 'Please select an occasion'],
            enum: { values: OCCASIONS, message: 'Invalid occasion selected' },
            default: 'None',
        },
        notes: {
            type: String,
            maxlength: [300, 'Special requests cannot exceed 300 characters'],
            trim: true,
            default: '',
        },
        photoPath: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;
