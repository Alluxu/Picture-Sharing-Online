"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // To access the user's email from cookies

const AddImagePage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
  });
  const [file, setFile] = useState<File | null>(null); // To handle the image file
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null); // Manage user email

  // Check if the user is logged in
  useEffect(() => {
    const email = Cookies.get('userEmail');
    if (!email) {
      // If no email is found in cookies, redirect to login page
      router.push('/');
    } else {
      setUserEmail(email);
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
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
    formDataToSubmit.append('picture', file); // Add the file
    formDataToSubmit.append('title', formData.title);
    formDataToSubmit.append('description', formData.description);
    formDataToSubmit.append('tags', formData.tags.split(',').map((tag) => tag.trim()).join(','));
    formDataToSubmit.append('user', userEmail || ''); // Append the user email

    try {
      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formDataToSubmit, // Send as FormData to handle file upload
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      // On success, redirect to the homepage or another page
      router.push('/');
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
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
            name="picture"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded"
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
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Upload Image
        </button>
      </form>
    </div>
  );
};

export default AddImagePage;
