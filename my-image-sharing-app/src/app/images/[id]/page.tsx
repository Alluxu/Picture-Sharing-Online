// src/app/images/[id]/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation'; // For handling not found cases and navigation
import Cookies from 'js-cookie'; // For managing user authentication

interface ImagePageProps {
  params: {
    id: string;
  };
}

interface Comment {
  id: number;
  email: string;
  commentText: string;
  createdAt: string;
  updatedAt: string;
}

const fetchImage = async (id: string) => {
  const response = await fetch(`/api/images/${id}`);
  if (!response.ok) {
    return null;
  }
  return await response.json();
};

const fetchComments = async (imageId: string) => {
  const response = await fetch(`/api/comments/${imageId}`);
  if (!response.ok) {
    return [];
  }
  return await response.json();
};

const ImagePage: React.FC<ImagePageProps> = ({ params }) => {
  const [image, setImage] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<string>('');
  const router = useRouter(); // Router to navigate after delete

  useEffect(() => {
    const fetchData = async () => {
      const fetchedImage = await fetchImage(params.id);
      if (!fetchedImage) {
        notFound();
      } else {
        setImage(fetchedImage);
        setTags(fetchedImage.tags);
      }

      const fetchedComments = await fetchComments(params.id);
      setComments(fetchedComments);

      const email = Cookies.get('userEmail');
      setUserEmail(email || null);
    };
    fetchData();
  }, [params.id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment) {
      setError('Please enter a comment');
      return;
    }

    try {
      const response = await fetch(`/api/comments/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, commentText: newComment }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }

      setNewComment('');
      setError(null);

      const updatedComments = await fetchComments(params.id);
      setComments(updatedComments);
    } catch (err) {
      console.error(err);
      setError('Error submitting comment');
    }
  };

  const handleTagsUpdate = async () => {
    try {
      const response = await fetch(`/api/images/${params.id}/edit-tags`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tags }),
      });

      if (!response.ok) {
        throw new Error('Failed to update tags');
      }

      alert('Tags updated successfully');
    } catch (err) {
      console.error('Error updating tags:', err);
      setError('Error updating tags');
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await fetch(`/api/images/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      alert('Image deleted successfully');
      router.push('/'); // Navigate back to homepage after deletion
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Error deleting image');
    }
  };

  if (!image) return <p>Loading...</p>;

  return (
    <div className="max-w-lg mx-auto py-8">
      <img src={`/api/uploads/${encodeURIComponent(image.filename)}`} alt={image.title} className="w-full h-auto" />
      <h1 className="text-2xl font-bold my-4">{image.title}</h1>
      <p className="text-lg mb-4">{image.description}</p>
      <p className="text-sm text-gray-500 mb-4">Tags: {image.tags.split(', ').join(', ')}</p>

      {userEmail === image.user_email && (
        <div className="my-6">
          <h2 className="text-xl font-bold mb-2">Edit Tags</h2>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleTagsUpdate}
            className="bg-green-500 text-white py-2 px-4 rounded mt-2"
          >
            Update Tags
          </button>

          <button
            onClick={handleDeleteImage}
            className="bg-red-500 text-white py-2 px-4 rounded mt-4 block"
          >
            Delete Image
          </button>
        </div>
      )}

      <div className="comments-section">
        <h2 className="text-xl font-bold mb-4">Comments</h2>
        {comments.length > 0 ? (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li key={comment.id} className="border-b pb-4">
                <p className="text-sm font-medium">{comment.email}</p>
                <p>{comment.commentText}</p>
                <small className="text-gray-500">
                  Posted on {new Date(comment.createdAt).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}

        {userEmail ? (
          <form onSubmit={handleCommentSubmit} className="mt-6 space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Write your comment here"
              rows={4}
              required
            />
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
              Submit Comment
            </button>
          </form>
        ) : (
          <p className="text-gray-500 mt-4">Log in to add a comment</p>
        )}
      </div>
    </div>
  );
};

export default ImagePage;
