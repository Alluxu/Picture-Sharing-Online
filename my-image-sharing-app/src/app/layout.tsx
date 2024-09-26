
import './globals.css';
import ClientLayout from './ClientLayout'; // Import the ClientLayout component

// Metadata for the website
export const metadata = {
  title: "Picture Sharing Online",
  description: "Next.js WebApp made by Alvar Gran",
};

// Server-side layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" /> {/* Add a favicon if available */}
      </head>
      <body>
        {/* Wrap the children with the ClientLayout */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}