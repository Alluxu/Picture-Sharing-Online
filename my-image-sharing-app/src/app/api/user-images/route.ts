import { NextResponse } from 'next/server';
import { createConnection } from 'mysql2/promise';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');

  if (!email) {
    return NextResponse.json({ message: 'Email query parameter is missing' }, { status: 400 });
  }

  try {
    // Connect to MySQL
    const connection = await createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'your-username',
      password: process.env.MYSQL_PASSWORD || '1337',
      database: process.env.MYSQL_DATABASE || 'your-database',
    });

    // Fetch images related to the user
    const [images]: any = await connection.execute(
      'SELECT * FROM images WHERE user_email = ?',
      [email]
    );

    await connection.end(); // Close the connection

    return NextResponse.json(images);
  } catch (error: any) {
    console.error('Error fetching user images:', error.message || error);
    return NextResponse.json({ message: 'Error fetching images' }, { status: 500 });
  }
}
