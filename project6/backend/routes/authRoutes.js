import express from 'express';
import { registerUser, loginUser, getMe, toggleFavorite } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/favorites/:propertyId', protect, toggleFavorite);

export default router;
