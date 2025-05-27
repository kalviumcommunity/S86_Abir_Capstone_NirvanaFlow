

import mongoose, { Schema, Document } from 'mongoose';


export interface ISubtask extends Document {
  eventId: string;
  title: string;
   priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'doing' | 'done';
  createdAt: Date;
}


const SubtaskSchema: Schema = new Schema({
  eventId: { type: mongoose.Types.ObjectId, ref: 'Event' },
  userId: { type: String, ref: 'User', required: true },
  title: { type: String, required: true },
  status: { type: String, enum: ['todo', 'doing', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Subtask || mongoose.model<ISubtask>('Subtask', SubtaskSchema);
