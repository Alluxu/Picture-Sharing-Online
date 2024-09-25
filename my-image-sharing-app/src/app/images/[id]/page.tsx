/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { createConnection } from 'mysql2/promise';
import { notFound } from 'next/navigation'; // For handling not found cases

interface ImagePageProps {
  params: {
    id: string;
  };
}

const fetchImage = async (id: string) => {
  // Establish a connection to MySQL
  const connection = await createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'your-username',
    password: process.env.MYSQL_PASSWORD || 'your-password',
    database: process.env.MYSQL_DATABASE || 'your-database',
  });

  // Fetch image by ID
  const [rows]: any = await connection.execute(
    'SELECT * FROM images WHERE id = ?',
    [id]
  );

  await connection.end(); // Close the MySQL connection

  // Return the first matching row or null if not found
  if (rows.length === 0) {
    return null;
  }
  return rows[0];
};

const ImagePage: React.FC<ImagePageProps> = async ({ params }) => {
  const image = await fetchImage(params.id);

  if (!image) {
    notFound(); // Redirect to 404 page if the image is not found
  }

  return (
    <div className="max-w-lg mx-auto py-8">
      <img src={`/uploads/${image.filename}`} alt={image.title} className="w-full h-auto" />
      <h1 className="text-2xl font-bold my-4">{image.title}</h1>
      <p className="text-lg mb-4">{image.description}</p>
      <p className="text-sm text-gray-500 mb-4">Tags: {image.tags.split(', ').join(', ')}</p>
    </div>
  );
};

export default ImagePage;
