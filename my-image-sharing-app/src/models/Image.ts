import { DataTypes, Model } from 'sequelize';
import sequelize from '@/lib/db'; // Assuming you have an existing Sequelize connection

// Define the interface for the Image model
export interface IImage extends Model {
  id: number;
  picture: string;
  user: string; // Email of the user who uploaded the image
  createdDate: Date;
  title: string;
  description: string;
  tags: string[]; // Store tags as JSON in MySQL
  isPublic: boolean;
}

// Define the Sequelize schema for the Image model
const ImageModel = sequelize.define<IImage>('Image', {
  picture: { type: DataTypes.STRING, allowNull: false },
  user: { type: DataTypes.STRING, allowNull: false },
  createdDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  tags: { type: DataTypes.JSON, defaultValue: [] }, // Use JSON type for MySQL
  isPublic: { type: DataTypes.BOOLEAN, defaultValue: true },
});

export default ImageModel;
