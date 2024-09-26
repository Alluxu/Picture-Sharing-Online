import { NextResponse } from 'next/server';
import ImageModel from '@/models/Image';

// PATCH method to update tags of an image by ID
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { tags } = await request.json(); // Extract the new tags from the request body

    // Find the image by ID
    const image = await ImageModel.findByPk(params.id);

    if (!image) {
      return NextResponse.json({ message: 'Image not found' }, { status: 404 });
    }

    // Update the tags of the image
    image.tags = tags;
    await image.save();

    return NextResponse.json({ message: 'Tags updated successfully', image });
  } catch (error) {
    console.error('Error updating tags:', error);
    return NextResponse.json({ message: 'Error updating tags' }, { status: 500 });
  }
}