import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db'; // Ensure you have a database connection
import UserModel from '@/models/User'; // User model for storing user data

export async function POST(request: Request) {
  await dbConnect();
  
  const { email, password } = await request.json();

  try {
    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Create a new user
    const newUser = new UserModel({ email, password });
    await newUser.save();

    return NextResponse.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ message: 'Error registering user' }, { status: 500 });
  }
}
