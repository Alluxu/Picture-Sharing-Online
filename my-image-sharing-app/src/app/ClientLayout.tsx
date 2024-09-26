"use client"; // Mark this as a Client Component

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import localFont from 'next/font/local';

// Import fonts
const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userEmail = Cookies.get('userEmail');
    setIsLoggedIn(!!userEmail);
  }, []);

  const handleLogout = () => {
    Cookies.remove('userEmail');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <header className="bg-blue-600 text-white p-4">
        <nav className="flex justify-center items-center h-16">
          <ul className="flex gap-6">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/add-image">Add Image</Link>
            </li>
            {isLoggedIn && (
              <li>
                <Link href="/profile">Profile</Link>
              </li>
            )}
          </ul>
          <ul className="absolute right-10 flex gap-6">
            {isLoggedIn ? (
              <li>
                <button onClick={handleLogout}>Log Out</button>
              </li>
            ) : (
              <>
                <li>
                  <Link href="/login">Login</Link>
                </li>
                <li>
                  <Link href="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}