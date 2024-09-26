import { NextResponse } from 'next/server';
import ImageModel from '@/models/Image';

export async function GET() {
  try {
    // Fetch all images from the database
    const images = await ImageModel.findAll({
        attributes: ['id', 'title', 'filename', 'user_email', 'tags', 'isPublic']
      });
      
    // If no images found
    if (!images || images.length === 0) {
      return NextResponse.json({ message: 'No images found' }, { status: 404 });
    }

    // Return the images as JSON
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ message: 'Error fetching images' }, { status: 500 });
  }
}