//src/app/api/images/[id]/route.ts
import { NextResponse } from 'next/server';
import ImageModel from '@/models/Image';

// GET method to fetch an image by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Find the image by ID
    const image = await ImageModel.findByPk(params.id);

    if (!image) {
      return NextResponse.json({ message: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json(image);
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json({ message: 'Error fetching image' }, { status: 500 });
  }
}

// DELETE method to delete an image by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Find and delete the image by ID
    const result = await ImageModel.destroy({
      where: { id: params.id }
    });

    if (result === 0) {
      return NextResponse.json({ message: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ message: 'Error deleting image' }, { status: 500 });
  }
}