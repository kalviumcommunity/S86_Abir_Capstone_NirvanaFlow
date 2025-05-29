import  { Schema, Document, models, model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  uid:string;
  googleAccessToken:string;
  googleRefreshToken:string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  uid: { type: String, required: true, unique: true },
  googleAccessToken: { type: String }, 
  googleRefreshToken: { type: String },
  createdAt: { type: Date, default: Date.now },
});


const User = models.User || model<IUser>('User', UserSchema);

export default User;
