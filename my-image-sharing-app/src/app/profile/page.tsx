
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface Image {
  _id: string;
  picture: string;
  title: string;
  isPublic: boolean; // Public/Private status
}

const ProfilePage: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false); // Hydration guard
  const router = useRouter();
  const userEmail = Cookies.get('userEmail'); // Get the logged-in user's email

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && userEmail) {
      const fetchUserImages = async () => {
        try {
          const res = await fetch(`/api/user-images?email=${userEmail}`);
          if (!res.ok) {
            throw new Error('Failed to fetch images');
          }
          const data = await res.json();
          setImages(data);
        } catch (err) {
          console.error('Error fetching user images:', err);
          setError('Failed to load images.');
        }
      };
      fetchUserImages();
    } else if (isClient && !userEmail) {
      router.push('/');
    }
  }, [isClient, userEmail, router]);

  // Handle Delete Image
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/images/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete image');
      }
      setImages(images.filter((image) => image._id !== id));
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image.');
    }
  };

  // Handle Toggle Public/Private with Switch
  const handleToggleVisibility = async (id: string, isPublic: boolean) => {
    try {
      const res = await fetch(`/api/images/${id}/toggle-visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !isPublic }),
      });
      if (!res.ok) {
        throw new Error('Failed to update image visibility');
      }
      const updatedImage = await res.json();
      setImages(images.map((img) => (img._id === id ? updatedImage : img)));
    } catch (err) {
      console.error('Error updating visibility:', err);
      setError('Failed to update image visibility.');
    }
  };

  if (!isClient) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Uploaded Images</h1>
      {error && <p className="text-red-500">{error}</p>}
      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <div key={image._id} className="border rounded-lg shadow-md overflow-hidden">
              <img src={image.picture} alt={image.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{image.title}</h2>
                <div className="flex items-center space-x-4 mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={image.isPublic}
                      onChange={() => handleToggleVisibility(image._id, image.isPublic)}
                      className="toggle-checkbox"
                    />
                    <span className="ml-2">{image.isPublic ? 'Public' : 'Private'}</span>
                  </label>
                  <a href={image.picture} download className="bg-green-500 text-white py-1 px-3 rounded">
                    Download
                  </a>
                  <button
                    onClick={() => handleDelete(image._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No images uploaded yet.</p>
      )}
    </div>
  );
};

export default ProfilePage;
