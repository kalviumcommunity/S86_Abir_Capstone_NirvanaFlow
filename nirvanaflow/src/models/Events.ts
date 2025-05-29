import mongoose,{Document} from 'mongoose';

import { ISubtask } from './Subtask';

export interface IEvent extends Document {
  userId:string;
  title:string;
  description:string;
  deadline:Date;
  subtasks:ISubtask[];
  createdFromGoogle:boolean;
  googleEventId:string;
  createdAt:Date
}


const EventSchema = new mongoose.Schema({
 userId: { type: String, ref: 'User', required: true }, 
  title: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date },
  subtasks: [{ type: mongoose.Types.ObjectId, ref: 'Subtask' }],
  createdFromGoogle: { type: Boolean, default: false }, 
  googleEventId: { type: String }, 
  createdAt: { type: Date, default: Date.now },
});


EventSchema.index({ userId: 1 });
EventSchema.index({ deadline: 1 });
export default mongoose.models.Event || mongoose.model('Event', EventSchema);
