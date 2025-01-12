import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hex = searchParams.get('hex');

  if (!hex || !hex.startsWith('steam:')) {
    console.error('[API] Invalid Steam Hex ID:', hex);
    return NextResponse.json({ error: 'A valid Steam Hex ID (e.g., steam:110000138bc2bb3) is required.' }, { status: 400 });
  }

  try {
    // Convert Hex to SteamID64
    const hexPart = hex.replace('steam:', '');
    const steamID64 = BigInt(`0x${hexPart}`).toString();

    // Fetch Steam profile data
    const apiKey = process.env.STEAM_API_KEY;
    if (!apiKey) {
      console.error('[API] Missing STEAM_API_KEY in environment variables.');
      throw new Error('STEAM_API_KEY not found in environment variables.');
    }

    const apiUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamID64}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Steam API responded with status ${response.status}`);
    }

    const data = await response.json();

    if (data.response.players && data.response.players.length > 0) {
      const player = data.response.players[0];
      return NextResponse.json(player);
    } else {
      return NextResponse.json({ error: 'No profile found for this Steam ID.' }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}

