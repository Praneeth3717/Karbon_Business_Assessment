import { Router } from 'express';
import { googleLogin, googleCallback, register, login } from '../controllers/authController';

const router = Router();

router.get('/google/login', googleLogin);
router.get('/google/callback', googleCallback);
router.post('/register', register);
router.post('/login', login);

export default router;

