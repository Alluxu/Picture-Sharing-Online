import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ImageModel from '@/models/Image';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const image = await ImageModel.findByIdAndDelete(params.id);
    if (!image) {
      return NextResponse.json({ message: 'Image not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ message: 'Error deleting image' }, { status: 500 });
  }
}