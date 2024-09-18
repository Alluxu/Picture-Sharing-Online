"use client";

import React, { useEffect, useState } from 'react';
import ImageCard from '@/components/ImageCard'; // Assuming you have a component to display each image

interface Image {
  _id: string; // Note: MongoDB uses _id by default
  title: string;
  author: string;
  imageUrl: string;
}

const HomePage: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null); // State to handle errors
  const imagesPerPage = 20;

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch('/api/images'); // Fetch from your API route

        if (!res.ok) {
          throw new Error('Failed to fetch images');
        }

        const data = await res.json();
        setImages(data);
      } catch (err) {
        console.error('Error fetching images:', err);
        setError('Failed to load images. Please try again later.');
      }
    }

    fetchImages();
  }, []);

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);

  const handleNextPage = () => setCurrentPage((prev) => prev + 1);
  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Image Gallery</h1>
      <a href="/add-image" className="bg-blue-500 text-white py-2 px-4 rounded mb-4 inline-block">
        Add New Image
      </a>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentImages.map((image) => (
            <ImageCard
              key={image._id}
              title={image.title}
              author={image.author}
              imageUrl={image.imageUrl}
            />
          ))}
        </div>
      )}
      <div className="flex justify-between mt-8">
        <button onClick={handlePreviousPage} disabled={currentPage === 1} className="btn">
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={indexOfLastImage >= images.length}
          className="btn"
        >
          Next
        </button>
      </div>
    </main>
  );
};

export default HomePage;
