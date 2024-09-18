import mongoose, { Document, Schema, Model } from 'mongoose';

// Define the interface for the Image document
export interface IImage extends Document {
  picture: string;
  user: string; // Email
  createdDate: Date;
  title: string;
  description: string;
  tags: string[];
}

// Define the schema for the Image model
const ImageSchema: Schema<IImage> = new Schema({
  picture: { type: String, required: true },
  user: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], default: [] },
});

// Create the Image model
const ImageModel: Model<IImage> = mongoose.models.Image || mongoose.model<IImage>('Image', ImageSchema);

export default ImageModel;
