import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    createReservation,
    getReservations,
    updateReservationStatus,
} from '../controllers/reservationController.js';
import protect, { adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Multer config — store uploaded files in uploads/ folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `photo-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB max
});

// POST /api/reservations — public
router.post('/', upload.single('photo'), createReservation);

// GET  /api/reservations — admin only
// PUT  /api/reservations/:id — admin only
router.use(protect, adminOnly);
router.get('/', getReservations);
router.put('/:id', updateReservationStatus);

export default router;
