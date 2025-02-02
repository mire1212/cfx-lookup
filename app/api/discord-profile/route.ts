import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const discordId = searchParams.get('discordId');

  if (!discordId) {
    return NextResponse.json({ error: "Invalid Discord ID" }, { status: 400 });
  }

  try {
    const apiUrl = `https://discord-lookup-api-green.vercel.app/v1/user/${discordId}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error("User not found");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
}