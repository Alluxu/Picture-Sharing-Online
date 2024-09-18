
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ImageModel from '@/models/Image';

export async function GET() {
  await dbConnect();

  try {
    const images = await ImageModel.find({});
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ message: 'Error fetching images' }, { status: 500 });
  }
}