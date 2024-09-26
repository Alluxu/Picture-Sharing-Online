// src/app/add-image/page.tsx

"use client"; // Add this at the top to make this a Client Component

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; 

const AddImagePage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    isPublic: true
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null); 
  const [isRedirecting, setIsRedirecting] = useState(false); // Add flag to prevent double execution

  // Check if the user is logged in
  useEffect(() => {
    const email = Cookies.get('userEmail');
    setUserEmail(email ?? null); // Use null if email is undefined
    if (!email && !isRedirecting) {
      alert('Please login before adding an image!');
      setIsRedirecting(true); // Set the flag
      router.push('/'); // Redirect to home page if not logged in
    }
  }, [router, isRedirecting]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError('Please select an image to upload.');
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('filename', file);
    formDataToSubmit.append('title', formData.title);
    formDataToSubmit.append('description', formData.description);
    formDataToSubmit.append('tags', formData.tags.split(',').map((tag) => tag.trim()).join(','));
    formDataToSubmit.append('user', userEmail || '');
    formDataToSubmit.append('isPublic', formData.isPublic ? 'true' : 'false');

    try {
      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formDataToSubmit,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to upload image');
      }

      router.push('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to upload image. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Upload a New Image</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Select Image</label>
          <input
            type="file"
            name="filename"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded"
            accept="image/*"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">User Email</label>
          <input
            type="email"
            name="user"
            value={userEmail || ''}
            className="w-full px-3 py-2 border rounded"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Public</label>
          <input
            type="checkbox"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleInputChange}
          />{' '}
          Make this image public
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Upload Image
        </button>
      </form>
    </div>
  );
};

export default AddImagePage;
