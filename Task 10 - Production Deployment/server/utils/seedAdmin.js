import User from '../models/User.js';

/**
 * Ensures that the single hardcoded admin account (admin / admin123) exists.
 * Called once at server startup after the DB is connected.
 * If the account already exists it makes no changes.
 */
export const seedAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('[Seed] Admin account already exists – skipping creation.');
            return;
        }

        // Pass plain password — the pre-save middleware in User.js will hash it once.
        await User.create({
            username: 'admin',
            password: 'admin123',
            role: 'admin',
        });

        console.log('[Seed] Admin account created successfully (admin / admin123).');
    } catch (err) {
        console.error('[Seed] Failed to seed admin account:', err.message);
    }
};
