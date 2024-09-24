import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ImageModel from '@/models/Image';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const { isPublic } = await request.json();

    const updatedImage = await ImageModel.findByIdAndUpdate(
      params.id,
      { isPublic },
      { new: true }
    );

    if (!updatedImage) {
      return NextResponse.json({ message: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json(updatedImage);
  } catch (error) {
    console.error('Error updating image visibility:', error);
    return NextResponse.json({ message: 'Error updating visibility' }, { status: 500 });
  }
}