"use client";

import React, { useEffect, useState } from 'react';
import ImageCard from '@/components/ImageCard'; // Assuming you have a component to display each image
import Cookies from 'js-cookie'; // For handling cookies

interface Image {
  _id: string; // Note: MongoDB uses _id by default
  title: string;
  user: string; // Assuming 'user' is the author field
  picture: string;
}

const HomePage: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null); // State to handle errors
  const imagesPerPage = 20;

  // State for managing user login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // State for login/register modal
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Track if it's login or register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

    // Check if user is logged in by checking the cookie
    const loggedInEmail = Cookies.get('userEmail');
    if (loggedInEmail) {
      setIsLoggedIn(true);
      setUserEmail(loggedInEmail);
    }

    fetchImages();
  }, []);

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);

  const handleNextPage = () => setCurrentPage((prev) => prev + 1);
  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Functions for handling login/register modal
  const handleLoginClick = () => {
    setIsLogin(true);
    setShowModal(true);
  };

  const handleRegisterClick = () => {
    setIsLogin(false);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/login' : '/api/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error('Failed to authenticate');
      }

      const data = await res.json();
      alert(`${isLogin ? 'Login' : 'Register'} successful!`);

      // Save the user email in cookies and update the state
      Cookies.set('userEmail', email);
      setIsLoggedIn(true);
      setUserEmail(email);
      setShowModal(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to authenticate.');
    }
  };

  // Log out functionality
  const handleLogout = () => {
    Cookies.remove('userEmail');
    setIsLoggedIn(false);
    setUserEmail(null);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex justify-end space-x-4 mb-6">
        {!isLoggedIn ? (
          <>
            <button
              onClick={handleLoginClick}
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              Login
            </button>
            <button
              onClick={handleRegisterClick}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Register
            </button>
          </>
        ) : (
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Logged in as: {userEmail}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded"
            >
              Log Out
            </button>
          </div>
        )}
      </header>

      {/* Main Image Gallery */}
      <h1 className="text-3xl font-bold mb-8">Image Gallery</h1>

      {/* Only show "Add Image" button if logged in */}
      {isLoggedIn && (
        <a href="/add-image" className="bg-blue-500 text-white py-2 px-4 rounded mb-4 inline-block">
          Add New Image
        </a>
      )}

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentImages.map((image) => (
            <ImageCard
              key={image._id}
              id={image._id}
              title={image.title}
              author={image.user}
              imageUrl={image.picture}
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

      {/* Modal for Login/Register */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              {isLogin ? 'Login' : 'Register'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded"
              >
                {isLogin ? 'Login' : 'Register'}
              </button>
            </form>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full text-red-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default HomePage;
