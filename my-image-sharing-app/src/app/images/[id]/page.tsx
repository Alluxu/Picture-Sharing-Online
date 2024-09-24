import React from 'react';
import dbConnect from '@/lib/db';
import ImageModel from '@/models/Image';
import { notFound } from 'next/navigation'; // For handling not found cases

interface ImagePageProps {
  params: {
    id: string;
  };
}

const fetchImage = async (id: string) => {
  await dbConnect();
  const image = await ImageModel.findById(id).lean();
  
  if (!image) {
    return null;
  }

  return image;
};

const ImagePage: React.FC<ImagePageProps> = async ({ params }) => {
  const image = await fetchImage(params.id);

  if (!image) {
    notFound(); // Redirect to 404 page if the image is not found
  }

  return (
    <div className="max-w-lg mx-auto py-8">
      <img src={image.picture} alt={image.title} className="w-full h-auto" />
      <h1 className="text-2xl font-bold my-4">{image.title}</h1>
      <p className="text-lg mb-4">{image.description}</p>
      <p className="text-sm text-gray-500 mb-4">Tags: {image.tags.join(', ')}</p>
    </div>
  );
};

export default ImagePage;
