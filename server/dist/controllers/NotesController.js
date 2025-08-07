"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNote = exports.createNote = exports.deleteNote = exports.getNotes = void 0;
const Note_1 = __importDefault(require("../models/Note"));
const getNotes = async (req, res) => {
    try {
        const notes = await Note_1.default.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(notes);
    }
    catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Error fetching notes' });
    }
};
exports.getNotes = getNotes;
const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Note_1.default.findOneAndDelete({ _id: id, userId: req.userId });
        res.json({ message: 'Note deleted' });
    }
    catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ message: 'Error deleting note' });
    }
};
exports.deleteNote = deleteNote;
const createNote = async (req, res) => {
    try {
        const { title, description, type } = req.body;
        const note = await Note_1.default.create({ userId: req.userId, title, description, type });
        res.status(201).json(note);
    }
    catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ message: 'Error creating note' });
    }
};
exports.createNote = createNote;
const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, type } = req.body;
        const updatedNote = await Note_1.default.findOneAndUpdate({ _id: id, userId: req.userId }, { title, description, type }, { new: true });
        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found or you do not have permission to update it' });
        }
        res.json(updatedNote);
    }
    catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ message: 'Error updating note' });
    }
};
exports.updateNote = updateNote;
//# sourceMappingURL=NotesController.js.map