import { Router } from 'express';
import { getNotes, createNote, deleteNote, updateNote } from '../controllers/NotesController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/get', verifyToken, getNotes);
router.post('/add', verifyToken, createNote);
router.put('/:id', verifyToken, updateNote);
router.delete('/:id', verifyToken, deleteNote);

export default router;
