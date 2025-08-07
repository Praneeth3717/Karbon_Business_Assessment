import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  googleId?: string;
  name: string;
  email: string;
  password?: string;
}

const userSchema = new mongoose.Schema<IUser>({
  googleId: { type: String, default: null },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },
}, { timestamps: true });

export default mongoose.model<IUser>('User', userSchema);