
import React from 'react';

interface ImageCardProps {
  id: string;        // Add the id prop to the interface
  title: string;
  author: string;
  imageUrl: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ id, title, author, imageUrl }) => {
  return (
    <a href={`/images/${id}`} className="border rounded-lg shadow-md overflow-hidden block">
      <img src={imageUrl} alt={title} className="w-full h-auto max-h-48 object-contain" />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-gray-500">by {author}</p>
      </div>
    </a>
  );
};

export default ImageCard;