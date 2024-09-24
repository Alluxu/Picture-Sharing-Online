import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ImageModel from '@/models/Image';

export async function GET(request: Request) {
  await dbConnect();
  const url = new URL(request.url);
  const email = url.searchParams.get('email');

  try {
    const images = await ImageModel.find({ user: email });
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching user images:', error);
    return NextResponse.json({ message: 'Error fetching images' }, { status: 500 });
  }
}