import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete('flashcards_gdrive_refresh_token');
  response.cookies.delete('flashcards_gdrive_user_email');
  return response;
}
