/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { createConnection } from 'mysql2/promise';
import formidable, { File } from 'formidable';
import path from 'path';
import fs from 'fs';

// Ensure the upload directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Replace the old 'config' usage with this:
export const dynamic = 'force-dynamic'; // Required for dynamic routes

export async function POST(req: any) {
  try {
    const form = new formidable.IncomingForm({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB max file size
    });

    const { fields, files }: { fields: any; files: any } = await new Promise((resolve, reject) => {
      form.parse(req as any, (err: any, fields: any, files: any) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const file = files.picture as File; // Assuming 'picture' is the name of the file input field
    const { title, description, tags, user } = fields; // Form fields

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Use `filepath` instead of `newFilename` to get the file path
    const filePath = file.path;

    // Connect to MySQL
    const connection = await createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'your-username',
      password: process.env.MYSQL_PASSWORD || 'your-password',
      database: process.env.MYSQL_DATABASE || 'your-database',
    });

    // Insert the new image metadata into the MySQL database
    const [result]: any = await connection.execute(
      'INSERT INTO images (filename, title, description, tags, user_email) VALUES (?, ?, ?, ?, ?)',
      [path.basename(filePath), title, description, tags.split(',').map((tag: string) => tag.trim()).join(','), user]
    );

    await connection.end(); // Close the MySQL connection

    return NextResponse.json({ message: 'Image uploaded successfully' });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ message: `Error uploading image: ${error.message}` }, { status: 500 });
  }
}
