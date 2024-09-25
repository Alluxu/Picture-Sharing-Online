import { NextResponse } from 'next/server';
import ImageModel from '@/models/Image';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { isPublic } = await request.json();

    // Find the image by primary key (ID) and update the `isPublic` field
    const [affectedRows, updatedImages] = await ImageModel.update(
      { isPublic }, // Fields to update
      {
        where: { id: params.id }, // Where clause to match the record by ID
        returning: true, // This works for PostgreSQL but can be removed for MySQL
      }
    );

    // Check if the image was found and updated
    if (affectedRows === 0) {
      return NextResponse.json({ message: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json(updatedImages[0]); // Return the first updated image
  } catch (error) {
    console.error('Error updating image visibility:', error);
    return NextResponse.json({ message: 'Error updating visibility' }, { status: 500 });
  }
}