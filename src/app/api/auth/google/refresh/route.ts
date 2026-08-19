import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return handleRefresh(request);
}

export async function POST(request: NextRequest) {
  return handleRefresh(request);
}

async function handleRefresh(request: NextRequest) {
  const refreshToken = request.cookies.get('flashcards_gdrive_refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { success: false, error: 'no_refresh_token', message: 'No stored refresh token found.' },
      { status: 401 }
    );
  }

  const clientId =
    process.env.GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { success: false, error: 'missing_credentials', message: 'GOOGLE_CLIENT_SECRET is missing from server environment.' },
      { status: 500 }
    );
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      return NextResponse.json(
        { success: false, error: 'refresh_failed', details: errText },
        { status: 400 }
      );
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in || 3600;

    return NextResponse.json({
      success: true,
      accessToken,
      expiresIn,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'exception', message: err.message },
      { status: 500 }
    );
  }
}
