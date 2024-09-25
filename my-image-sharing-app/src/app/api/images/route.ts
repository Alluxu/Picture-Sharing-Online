// src/app/api/images/route.ts
import { createConnection } from 'mysql2/promise';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Prevent prerendering

export async function GET(req: Request) {
  try {
    // Connect to the MySQL database
    const connection = await createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'your-username',
      password: process.env.MYSQL_PASSWORD || 'your-password',
      database: process.env.MYSQL_DATABASE || 'your-database',
    });

    // Fetch all images from the "images" table
    const [rows] = await connection.execute('SELECT * FROM images');

    await connection.end(); // Close the MySQL connection

    // Log the fetched rows
    console.log('Fetched rows:', rows);

    return NextResponse.json(rows); // Return images as JSON
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ message: 'Error fetching images' }, { status: 500 });
  }
}
