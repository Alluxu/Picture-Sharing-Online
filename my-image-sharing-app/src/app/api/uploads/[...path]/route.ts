// src/app/api/uploads/[...path]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const filePathSegments = params.path;

  if (!filePathSegments || filePathSegments.length === 0) {
    return NextResponse.json({ error: 'No path provided' }, { status: 400 });
  }

  // Define the uploads directory
  const uploadsDir = path.join(process.cwd(), 'uploads');

  // Join the segments to create the full file path
  const filePath = path.join(uploadsDir, ...filePathSegments);
  const resolvedPath = path.resolve(filePath);

  // Security check to prevent directory traversal attacks
  if (!resolvedPath.startsWith(uploadsDir)) {
    return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
  }

  try {
    const data = fs.readFileSync(filePath);

    // Determine the MIME type of the file
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';

    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
