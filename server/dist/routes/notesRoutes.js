"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NotesController_1 = require("../controllers/NotesController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/get', authMiddleware_1.verifyToken, NotesController_1.getNotes);
router.post('/add', authMiddleware_1.verifyToken, NotesController_1.createNote);
router.put('/:id', authMiddleware_1.verifyToken, NotesController_1.updateNote);
router.delete('/:id', authMiddleware_1.verifyToken, NotesController_1.deleteNote);
exports.default = router;
//# sourceMappingURL=notesRoutes.js.map