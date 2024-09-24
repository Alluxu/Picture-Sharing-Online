import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ImageModel from '@/models/Image';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: './public/uploads/', // Ensure this directory exists
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4() + path.extname(file.originalname); // Generate a unique filename
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

// Helper to handle the file upload process
export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle multipart form data
  },
};

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Use Multer to process the incoming request with the file
    const form = await new Promise((resolve, reject) => {
      upload.single('picture')(req as any, {} as any, (err: any) => {
        if (err) reject(err);
        resolve({ file: req.file });
      });
    });

    const file = (form as any).file; // Get the uploaded file details
    const { title, description, tags, user } = req.body; // Get the form data

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Create a new image document using the Image model
    const newImage = new ImageModel({
      picture: `/uploads/${file.filename}`, // Store the file path
      title,
      description,
      tags: tags.split(',').map((tag: string) => tag.trim()), // Convert tags to array
      user, // Email of the user who uploaded the image
    });

    await newImage.save(); // Save the image document to the database

    return NextResponse.json({ message: 'Image uploaded successfully', image: newImage });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ message: `Error uploading image: ${error.message}` }, { status: 500 });
  }
}