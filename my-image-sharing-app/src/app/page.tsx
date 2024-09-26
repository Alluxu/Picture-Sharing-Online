"use client";

import React, { useEffect, useState } from 'react';
import ImageCard from '@/components/ImageCard'; 
import Cookies from 'js-cookie'; // To check if the user is logged in

interface Image {
  id: string;
  title: string;
  user_email: string;
  filename: string;
  isPublic: boolean;
}

const HomePage: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null); // State to handle errors
  const imagesPerPage = 20;
  const [isLoggedIn, setIsLoggedIn] = useState(false); // To manage login state

  useEffect(() => {
    // Check if the user is logged in
    const userEmail = Cookies.get('userEmail');
    setIsLoggedIn(!!userEmail); // If there's a user email in cookies, set login state

    // Fetch images from API
    async function fetchImages() {
      try {
        const res = await fetch('/api/images'); // Fetch from your API route

        if (!res.ok) {
          throw new Error('Failed to fetch images');
        }

        const data = await res.json();
        const publicImages = data.filter((image: Image) => image.isPublic);
        setImages(publicImages);
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
      <h1 className="text-3xl font-bold mb-2">Public Image Gallery</h1>

      {/* Display message if the user is not logged in */}
      {!isLoggedIn && (
        <p className="text-center text-gray-500 mb-6">
          Register/Login to add images!
        </p>
      )}

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentImages.map((image) => (
            <ImageCard
              key={image.id}
              id={image.id}
              title={image.title}
              author={image.user_email}
              imageUrl={`/uploads/${image.filename}`}
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
