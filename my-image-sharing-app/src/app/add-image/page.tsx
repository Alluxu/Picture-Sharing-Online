"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // To access the user's email from cookies

const AddImagePage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    picture: '',
    user: '',
    title: '',
    description: '',
    tags: '',
  });
  const [error, setError] = useState<string | null>(null);

  // Check if the user is logged in
  useEffect(() => {
    const userEmail = Cookies.get('userEmail');
    if (!userEmail) {
      // If no email is found in cookies, redirect to login page
      router.push('/');
    } else {
      // If logged in, automatically fill in the user email field
      setFormData((prev) => ({ ...prev, user: userEmail }));
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Prepare data for submission
    const data = {
      ...formData,
      tags: formData.tags.split(',').map((tag) => tag.trim()), // Convert tags to array
    };

    try {
      const response = await fetch('/api/images/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to add image');
      }

      // On success, redirect to home or another page
      router.push('/');
    } catch (err) {
      console.error('Error adding image:', err);
      setError('Failed to add image. Please try again.');
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add a New Image</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            type="text"
            name="picture"
            value={formData.picture}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">User Email</label>
          <input
            type="email"
            name="user"
            value={formData.user}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
            readOnly // The user email should be read-only since it’s auto-filled
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
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Add Image
        </button>
      </form>
    </div>
  );
};

export default AddImagePage;
