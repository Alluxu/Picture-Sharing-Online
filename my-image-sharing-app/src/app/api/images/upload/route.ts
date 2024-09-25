import { createConnection } from 'mysql2/promise'; // Add this import
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const tags = formData.get('tags') as string;
    const user = formData.get('user') as string;
    const file = formData.get('filename') as File;
    const isPublic = formData.get('isPublic') === 'true'; // Capture the boolean value

    // Check if a file was uploaded
    if (!file || typeof file === 'string') {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const filePath = path.join(uploadDir, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Store the image data in the database
    const connection = await createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'your-username',
      password: process.env.MYSQL_PASSWORD || '1337',
      database: process.env.MYSQL_DATABASE || 'your-database',
    });

    const [result] = await connection.execute(
      'INSERT INTO images (filename, title, description, tags, user_email, isPublic) VALUES (?, ?, ?, ?, ?, ?)',
      [file.name, title, description, tags, user, isPublic]
    );

    await connection.end();

    return NextResponse.json({ message: 'Image uploaded successfully' });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ message: 'Failed to upload image' }, { status: 500 });
  }
}
