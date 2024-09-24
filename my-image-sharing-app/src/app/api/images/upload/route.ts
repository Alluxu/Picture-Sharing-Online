import { NextResponse } from 'next/server';
import formidable from 'formidable';
import { createConnection } from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle file uploads
  },
};

const uploadDir = './public/uploads'; // Directory to save uploaded images

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req: Request) {
  try {
    // Parse the incoming form, including files and other fields
    const form = new formidable.IncomingForm({
      uploadDir,
      keepExtensions: true, // Preserve file extensions
      maxFileSize: 5 * 1024 * 1024, // Max file size 5MB
    });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    // Extracting form fields and file information
    const { title, description, tags, user } = fields;
    const file = files.picture; // Assuming 'picture' is the name of the file input

    // If file doesn't exist, throw an error
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Connect to MySQL
    const connection = await createConnection({
      host: 'localhost',
      user: 'your-username',
      password: 'your-password',
      database: 'your-database',
    });

    // Save metadata to MySQL
    const [result] = await connection.execute(
      'INSERT INTO images (filename, title, description, tags, user_email) VALUES (?, ?, ?, ?, ?)',
      [file.newFilename, title, description, tags, user]
    );

    await connection.end();

    // Send success response
    return NextResponse.json({ message: 'Image uploaded successfully' });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ message: 'Failed to upload image' }, { status: 500 });
  }
}
