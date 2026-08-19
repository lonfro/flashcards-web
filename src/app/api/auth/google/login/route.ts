import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const clientId =
    process.env.GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    searchParams.get('client_id');

  if (!clientId) {
    return NextResponse.json(
      {
        error:
          'Missing Google Client ID. Please configure GOOGLE_CLIENT_ID in your environment or Vercel Settings.',
      },
      { status: 400 }
    );
  }

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const redirectUri = `${proto}://${host}/api/auth/google/callback`;

  const authEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
  const scopes = 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/userinfo.email';

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes,
    access_type: 'offline',
    prompt: 'consent',
  });

  return NextResponse.redirect(`${authEndpoint}?${params.toString()}`);
}
