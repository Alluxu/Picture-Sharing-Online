import { DataTypes, Model } from 'sequelize';
import sequelize from '@/lib/db'; // Assuming you have an existing Sequelize connection

// Define the interface for the Image model
export interface IImage extends Model {
  id: number;
  filename: string;
  user_email: string; // Email of the user who uploaded the image
  title: string;
  description: string;
  tags: string[]; // Store tags as JSON in MySQL
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Sequelize schema for the Image model
const ImageModel = sequelize.define<IImage>('Image', {
  filename: { type: DataTypes.STRING, allowNull: false },
  user_email: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  tags: { type: DataTypes.JSON, defaultValue: [] }, // Use JSON type for MySQL
  isPublic: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'images',  
  freezeTableName: true,
  timestamps: true,
});

export default ImageModel;
