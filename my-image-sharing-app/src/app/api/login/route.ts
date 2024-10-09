
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

    // Query the database to check for the user with matching email and password
    const [rows]: any = await connection.execute(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    await connection.end(); // Close the MySQL connection

    // Check if any rows were returned (i.e., user exists)
    if (rows.length === 0) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Login successful' });
  } catch (error: any) {
    console.error('Error logging in user:', error.message || error);
    return NextResponse.json({ message: 'Error logging in' }, { status: 500 });
  }
}
