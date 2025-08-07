import mongoose, { Document } from "mongoose";
import User from "./User";

export interface INote extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: "personal" | "home" | "business";
}

const noteSchema = new mongoose.Schema<INote>({
    userId: {type: mongoose.Schema.Types.ObjectId,ref: User,required: true,},
    title: {type: String,required: true,},
    description: {type: String,required: true,},
    type: {type: String,enum: ["personal", "home", "business"],required: true,},
  },
  { timestamps: true }
);

export default mongoose.model<INote>("Note", noteSchema);
