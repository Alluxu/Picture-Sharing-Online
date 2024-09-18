import React from 'react';

interface ImageCardProps {
  title: string;
  author: string;
  imageUrl: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ title, author, imageUrl }) => {
  return (
    <div className="border rounded-lg shadow-md overflow-hidden">
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-gray-500">by {author}</p>
      </div>
    </div>
  );
};

export default ImageCard;