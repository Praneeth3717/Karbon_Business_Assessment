import { Router } from 'express';
import { googleLogin, googleCallback, register, login ,verifyUser} from '../controllers/authController';
import { verifyToken } from '../middleware/authMiddleware';


const router = Router();

router.get('/google/login', googleLogin);
router.get('/google/callback', googleCallback);
router.post('/register', register);
router.post('/login', login);
router.get('/verify', verifyToken, verifyUser);


export default router;

