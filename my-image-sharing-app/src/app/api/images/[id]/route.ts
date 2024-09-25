import { NextResponse } from 'next/server';
import ImageModel from '@/models/Image';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Find and delete the image by ID using Sequelize's `destroy` method
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
