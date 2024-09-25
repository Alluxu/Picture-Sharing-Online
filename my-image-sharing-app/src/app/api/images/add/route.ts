/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { createConnection } from 'mysql2/promise'; // Use MySQL connection

export async function POST(request: Request) {
  try {
    const data = await request.json(); // Parse the JSON body
    const { picture, user, title, description, tags } = data;

    // Ensure all required fields are provided
    if (!picture || !user || !title || !description) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Connect to MySQL
    const connection = await createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'your-username',
      password: process.env.MYSQL_PASSWORD || 'your-password',
      database: process.env.MYSQL_DATABASE || 'your-database',
    });

    // Insert the image data into MySQL
    const [result] = await connection.execute(
      'INSERT INTO images (picture, user, title, description, tags, createdDate) VALUES (?, ?, ?, ?, ?, ?)',
      [picture, user, title, description, tags, new Date()]
    );

    await connection.end(); // Close the MySQL connection

    return NextResponse.json({ message: 'Image added successfully', result });
  } catch (error: any) {
    console.error('Error adding image:', error.message || error); // Log the error message for debugging
    return NextResponse.json({ message: `Error adding image: ${error.message}` }, { status: 500 });
  }
}
