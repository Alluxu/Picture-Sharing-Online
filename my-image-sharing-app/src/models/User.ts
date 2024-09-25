import { DataTypes, Model } from 'sequelize';
import sequelize from '@/lib/db'; // Assuming you have your Sequelize instance setup

// Define the interface for the User model
export interface IUser extends Model {
  id: number;
  email: string;
  password: string;
}

// Define the Sequelize schema for the User model
const UserModel = sequelize.define<IUser>('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default UserModel;
