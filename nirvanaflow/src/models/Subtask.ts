

import mongoose, { Schema, Document } from 'mongoose';
import Users from './Users';

export interface ISubtask extends Document {
  title: string;
  parentTitle: string; 
  userId: mongoose.Types.ObjectId;
  status: 'todo' | 'doing' | 'done';
  priority: 1 | 2 | 3;
  createdAt: Date;
  deadline:Date;
}

const SubtaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  parentTitle: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['todo', 'doing', 'done'], default: 'todo' },
  priority: { type: Number, enum: [1, 2, 3], required: true },
  createdAt: { type: Date, default: Date.now },
  deadline:{type:Date}
});

export default mongoose.models.Subtask || mongoose.model<ISubtask>('Subtask', SubtaskSchema);
