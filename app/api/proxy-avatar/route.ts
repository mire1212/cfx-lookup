import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const avatarUrl = searchParams.get('url');

  if (!avatarUrl) {
    return NextResponse.json({ error: "Invalid avatar URL" }, { status: 400 });
  }

  try {
    const response = await fetch(avatarUrl);
    const imageBuffer = await response.arrayBuffer();

    return new Response(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch avatar" }, { status: 500 });
  }
}
