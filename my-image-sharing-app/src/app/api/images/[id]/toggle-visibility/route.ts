import { NextResponse } from 'next/server';
import ImageModel from '@/models/Image';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { isPublic } = await request.json();

    // Find the image by primary key (ID) and update the `isPublic` field
    const updatedImage = await ImageModel.update(
      { isPublic }, // Fields to update
      {
        where: { id: params.id }, // Where clause to match the record by ID
        returning: true, // Ensures Sequelize returns the updated instance (for PostgreSQL)
      }
    );

    if (!updatedImage[1].length) {
      return NextResponse.json({ message: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json(updatedImage[1][0]); // Return the updated image
  } catch (error) {
    console.error('Error updating image visibility:', error);
    return NextResponse.json({ message: 'Error updating visibility' }, { status: 500 });
  }
}