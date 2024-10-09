
import { NextResponse } from 'next/server';
import { createConnection } from 'mysql2/promise'; // Use MySQL connection

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Ensure email and password are provided
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Connect to MySQL
    const connection = await createConnection({
      host: process.env.MYSQL_HOST || 'mysql',
      user: process.env.MYSQL_USER || 'your-username',
      password: process.env.MYSQL_PASSWORD || '1337',
      database: process.env.MYSQL_DATABASE || 'your-database',
    });

    // Check if the user already exists
    const [existingUser]: any = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Insert new user into the MySQL database
    const [result]: any = await connection.execute(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, password]
    );

    await connection.end(); // Close the connection

    return NextResponse.json({ message: 'User registered successfully' });
  } catch (error: any) {
    console.error('Error registering user:', error.message || error);
    return NextResponse.json({ message: 'Error registering user' }, { status: 500 });
  }
}
