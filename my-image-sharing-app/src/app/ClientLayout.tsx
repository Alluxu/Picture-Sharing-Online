"use client"; // Mark this as a Client Component

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for showing modal
  const [isLogin, setIsLogin] = useState(true); // Track if modal is for login or register
  const [email, setEmail] = useState(''); // Store email input
  const [password, setPassword] = useState(''); // Store password input
  const [error, setError] = useState<string | null>(null); // Handle error messages

  useEffect(() => {
    const userEmail = Cookies.get('userEmail');
    setIsLoggedIn(!!userEmail);
  }, []);

  const handleLogout = () => {
    Cookies.remove('userEmail');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const handleLoginClick = () => {
    setIsLogin(true);
    setShowModal(true);
  };

  const handleRegisterClick = () => {
    setIsLogin(false);
    setShowModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/login' : '/api/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to authenticate');
        return;
      }

      Cookies.set('userEmail', email); // Set the email in cookies
      setIsLoggedIn(true); // Mark the user as logged in
      setShowModal(false); // Close the modal
      window.location.reload(); // Reload to reflect login state
    } catch (err) {
      setError('Failed to login. Please try again.');
    }
  };

  return (
    <div>
      <header className="bg-blue-600 text-white p-4">
        <nav className="flex justify-center space-x-4"> {/* Center the navigation */}
          <ul className="flex space-x-4">
            <li>
              <Link href="/">Home</Link>
            </li>
            {isLoggedIn && (
              <>
                <li>
                  <Link href="/add-image">Add Image</Link>
                </li>
                <li>
                  <Link href="/profile">Profile</Link>
                </li>
              </>
            )}
          </ul>
          <ul className="flex space-x-4 absolute right-4"> {/* Keep login/logout aligned to the right */}
            {isLoggedIn ? (
              <li>
                <button onClick={handleLogout}>Log Out</button>
              </li>
            ) : (
              <>
                <li>
                  <button onClick={handleLoginClick}>Login</button>
                </li>
                <li>
                  <button onClick={handleRegisterClick}>Register</button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>

      <main>{children}</main>

      {/* Modal for Login/Register */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              {isLogin ? 'Login' : 'Register'}
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Set email input
                  required
                />
              </div>
              <div>
                <label>Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Set password input
                  required
                />
              </div>
              {error && <p className="text-red-500">{error}</p>} {/* Display errors */}
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                {isLogin ? 'Login' : 'Register'}
              </button>
            </form>
            <button onClick={() => setShowModal(false)} className="mt-4 w-full text-red-500">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
