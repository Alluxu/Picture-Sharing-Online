import mongoose, { Document, Schema, Model } from 'mongoose';

// Define the user interface
export interface IUser extends Document {
  email: string;
  password: string;
}

// Create the user schema
const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Create and export the user model
const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;
