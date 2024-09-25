/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { IncomingForm, Fields, Files, File } from 'formidable';
import { createConnection } from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req: Request) {
  try {
    const form = new IncomingForm({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024,
    });

    const { fields, files }: { fields: Fields; files: Files } = await new Promise((resolve, reject) => {
      form.parse(req, (err: any, fields: Fields, files: Files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const { title, description, tags, user } = fields;
    const file = files.picture as File;

    if (!file) {
      throw new Error('No file uploaded');
    }

    const filePath = file.path;

    const connection = await createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'your-username',
      password: process.env.MYSQL_PASSWORD || 'your-password',
      database: process.env.MYSQL_DATABASE || 'your-database',
    });

    const [result] = await connection.execute(
      'INSERT INTO images (filename, title, description, tags, user_email) VALUES (?, ?, ?, ?, ?)',
      [path.basename(filePath), title, description, tags, user]
    );

    await connection.end();

    return NextResponse.json({ message: 'Image uploaded successfully' });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ message: 'Failed to upload image' }, { status: 500 });
  }
}
