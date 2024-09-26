// src/app/api/comments/[imageId]/route.ts
import { createConnection } from 'mysql2/promise';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { imageId: string } }) {
  const imageId = params.imageId;

  try {
    const connection = await createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'your-username',
      password: process.env.MYSQL_PASSWORD || '1337',
      database: process.env.MYSQL_DATABASE || 'your_database',
    });

    // Fetch all comments for a specific image
    const [rows] = await connection.execute(
      'SELECT * FROM comments WHERE imageReference = ? ORDER BY createdAt DESC',
      [imageId]
    );
    await connection.end();
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ message: 'Error fetching comments' }, { status: 500 });
  }
}
// src/app/api/comments/[imageId]/route.ts
export async function POST(request: Request, { params }: { params: { imageId: string } }) {
  const imageId = params.imageId;

  try {
    const formData = await request.json(); // Expect JSON body for comment

    const { email, commentText } = formData;

    const connection = await createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'your-username',
      password: process.env.MYSQL_PASSWORD || '1337',
      database: process.env.MYSQL_DATABASE || 'your_database',
    });

    // Insert the new comment into the `comments` table
    await connection.execute(
      'INSERT INTO comments (email, commentText, imageReference) VALUES (?, ?, ?)',
      [email, commentText, imageId]
    );

    await connection.end();

    return NextResponse.json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ message: 'Failed to add comment' }, { status: 500 });
  }
}
