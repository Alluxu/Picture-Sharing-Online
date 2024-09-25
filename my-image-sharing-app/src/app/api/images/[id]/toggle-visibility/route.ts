import { NextResponse } from 'next/server';
import ImageModel from '@/models/Image';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { isPublic } = await request.json();

    // Update the isPublic field for the given image ID
    const [affectedRows] = await ImageModel.update(
      { isPublic }, 
      { where: { id: params.id } }
    );

    if (affectedRows === 0) {
      return NextResponse.json({ message: 'Image not found' }, { status: 404 });
    }

    // Fetch the updated image to return it in the response
    const updatedImage = await ImageModel.findOne({ where: { id: params.id } });

    if (!updatedImage) {
      return NextResponse.json({ message: 'Error fetching updated image' }, { status: 500 });
    }

    return NextResponse.json(updatedImage); // Return the updated image
  } catch (error) {
    console.error('Error updating image visibility:', error);
    return NextResponse.json({ message: 'Error updating visibility' }, { status: 500 });
  }
}
