import mongoose, { Document, Schema, Model } from 'mongoose';

// Define the interface for the Image document
export interface IImage extends Document {
  picture: string;
  user: string; // Email of the user who uploaded the image
  createdDate: Date;
  title: string;
  description: string;
  tags: string[];
  isPublic: boolean; // Visibility flag
}

// Define the schema for the Image model
const ImageSchema: Schema<IImage> = new Schema({
  picture: { type: String, required: true },
  user: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], default: [] },
  isPublic: { type: Boolean, default: true }, // Default to public
});

// Create the Image model
const ImageModel: Model<IImage> = mongoose.models.Image || mongoose.model<IImage>('Image', ImageSchema);

export default ImageModel;