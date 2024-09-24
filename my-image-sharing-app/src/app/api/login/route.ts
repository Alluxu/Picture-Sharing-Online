import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db'; // Ensure you have a database connection
import UserModel from '@/models/User'; // User model for fetching user data

export async function POST(request: Request) {
  await dbConnect();

  const { email, password } = await request.json();

  try {
    // Check if the user exists and if the password matches
    const user = await UserModel.findOne({ email, password });

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in user:', error);
    return NextResponse.json({ message: 'Error logging in' }, { status: 500 });
  }
}
