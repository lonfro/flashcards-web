import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return new NextResponse(
      `<html><body><script>
        if (window.opener) {
          window.opener.postMessage({ type: 'GOOGLE_AUTH_ERROR', error: '${error || 'no_code'}' }, '*');
          window.close();
        } else {
          window.location.href = '/?auth=error';
        }
      </script><h2>Authentication failed: ${error || 'No authorization code'}</h2></body></html>`,
      { headers: { 'Content-Type': 'text/html' }, status: 400 }
    );
  }

  const clientId =
    process.env.GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new NextResponse(
      `<html><body><h2>Server configuration error: GOOGLE_CLIENT_SECRET is missing.</h2><p>Please add GOOGLE_CLIENT_SECRET to your Vercel Environment Variables.</p></body></html>`,
      { headers: { 'Content-Type': 'text/html' }, status: 500 }
    );
  }

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const redirectUri = `${proto}://${host}/api/auth/google/callback`;

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      return new NextResponse(
        `<html><body><h2>Token exchange error: ${errText}</h2></body></html>`,
        { headers: { 'Content-Type': 'text/html' }, status: 400 }
      );
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;
    const expiresIn = tokenData.expires_in || 3600;

    // Fetch user profile email
    let userEmail = '';
    try {
      const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        userEmail = userData.email || '';
      }
    } catch (e) {}

    const response = new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head><title>Google Sign-In Successful</title></head>
        <body style="background:#020617;color:#f8fafc;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
          <div style="text-align:center;padding:20px;border:1px solid #1e293b;border-radius:12px;background:#0f172a;">
            <h3 style="color:#10b981;margin-top:0;">✓ Connected to Google Drive!</h3>
            <p style="color:#94a3b8;font-size:13px;">Returning to Flashcards...</p>
          </div>
          <script>
            try {
              if (window.opener) {
                window.opener.postMessage({
                  type: 'GOOGLE_AUTH_SUCCESS',
                  accessToken: ${JSON.stringify(accessToken)},
                  expiresIn: ${expiresIn},
                  email: ${JSON.stringify(userEmail)}
                }, '*');
                setTimeout(() => window.close(), 400);
              } else {
                localStorage.setItem('flashcards_web_gdrive_access_token_v1', ${JSON.stringify(accessToken)});
                localStorage.setItem('flashcards_web_gdrive_token_exp_v1', (Date.now() + (${expiresIn} - 60) * 1000).toString());
                if (${JSON.stringify(userEmail)}) {
                  localStorage.setItem('flashcards_web_gdrive_user_email_v1', ${JSON.stringify(userEmail)});
                }
                window.location.href = '/';
              }
            } catch (e) {
              window.location.href = '/';
            }
          </script>
        </body>
      </html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );

    // Set secure HttpOnly cookie for the permanent refresh_token
    if (refreshToken) {
      response.cookies.set('flashcards_gdrive_refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 365 * 24 * 60 * 60, // 1 year
      });
    }

    if (userEmail) {
      response.cookies.set('flashcards_gdrive_user_email', userEmail, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 365 * 24 * 60 * 60,
      });
    }

    return response;
  } catch (err: any) {
    return new NextResponse(
      `<html><body><h2>Sign-in failed: ${err.message}</h2></body></html>`,
      { headers: { 'Content-Type': 'text/html' }, status: 500 }
    );
  }
}
