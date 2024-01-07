import { NextResponse } from 'next/server';
import * as jose from 'jose';

// filter middleware to run on specific paths.
export const config = {
  matcher: [
    '/api/auth',
    '/api/users/delete',
    '/api/users/fetch',
    '/api/users/updateProfile',
    '/api/gameList/addGame',
    '/api/gameList/deleteGame/:gameId*',
    '/api/gameList/getGameList',
    '/api/gameList/updateGame/:gameId*',
  ],
};

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-auth-token',
};

export default async function middleware(req) {
  if (req.method === 'OPTIONS') {
    return NextResponse.json({}, { headers: corsHeaders });
  }

  // Get token from header
  const token = req.headers.get('x-auth-token');

  // Check if no token
  if (!token) {
    return NextResponse.json(
      { errors: 'No token, authorization denied' },
      { status: 401 }
    );
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  // Verify token
  try {
    const { payload } = await jose.jwtVerify(token, secret);

    if (payload.user.id) {
      // add userId to headers
      // cookies somehow fails

      const newHeaders = new Headers(req.headers);
      newHeaders.set('userId', payload.user.id);
      return NextResponse.next({
        request: {
          headers: newHeaders,
        },
      });
    } else {
      return NextResponse.json({ errors: 'Token is not valid' }, { status: 401 });
    }
  } catch (err) {
    console.log('auth middleware error: ' + err);
    return NextResponse.json({ errors: 'Server Error' }, { status: 500 });
  }
}
