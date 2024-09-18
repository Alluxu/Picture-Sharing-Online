
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ImageModel from '@/models/Image';

export async function POST(request: Request) {
  await dbConnect(); // Ensure the database connection is established

  try {
    const data = await request.json(); // Parse the JSON body

    const { picture, user, title, description, tags } = data;

    // Ensure all required fields are provided
    if (!picture || !user || !title || !description) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Create a new image document using the Image model
    const newImage = new ImageModel({
      picture,
      user,
      title,
      description,
      tags,
      createdDate: new Date(),
    });

    await newImage.save(); // Save the new image to the database

    return NextResponse.json({ message: 'Image added successfully', image: newImage });
  } catch (error: any) {
    console.error('Error adding image:', error.message || error); // Log the error message for debugging
    return NextResponse.json({ message: `Error adding image: ${error.message}` }, { status: 500 });
  }
}