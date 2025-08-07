import { Request, Response } from 'express'
import Note from '../models/Note'

interface AuthRequest extends Request {
  userId?: string;
}

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(notes)
  } catch (error) {
    console.error('Error fetching notes:',error)
    res.status(500).json({ message:'Error fetching notes'})
  }
}

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const result = await Note.findOneAndDelete({ _id: id, userId: req.userId })
    res.json({ message: 'Note deleted' })
  } catch (error) {
    console.error('Error deleting note:', error)
    res.status(500).json({ message: 'Error deleting note' })
  }
}

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, type } = req.body;
    const note = await Note.create({ userId: req.userId, title, description, type });
    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ message: 'Error creating note' });
  }
};

export const updateNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, type } = req.body;
    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { title, description, type },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found or you do not have permission to update it' });
    }

    res.json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ message: 'Error updating note' });
  }
};

