/* eslint-disable @typescript-eslint/no-explicit-any */
import { createConnection } from 'mysql2/promise';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Add this to prevent prerendering

export async function GET(req: Request) {
  const connection = await createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'your_user',
    password: process.env.MYSQL_PASSWORD || 'your_password',
    database: process.env.MYSQL_DATABASE || 'your_database',
  });

  // Fetch images from MySQL
  const [rows] = await connection.execute('SELECT * FROM images');

  // Return images in response
  return new NextResponse(JSON.stringify(rows), { status: 200 });
}