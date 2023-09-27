import { NextResponse } from 'next/server';
import * as jose from 'jose';

// filter middleware to run on specific paths.
export const config = {
  matcher: [
    '/api/auth',
    '/api/users/delete',
    '/api/gameList/addGame',
    '/api/gameList/deleteGame/:gameId*',
    '/api/gameList/getGameList',
    '/api/gameList/updateGame/:gameId*',
  ],
};

export default async function middleware(req) {
  const response = NextResponse.next();
  response.headers.append('Access-Control-Allow-Origin', '*');
  response.headers.append('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');
  response.headers.append('Access-Control-Allow-Credentials', 'true');

  // Get token from header
  const token = req.headers.get('x-auth-token');

  // Check if no token
  if (!token) {
    return NextResponse.json(
      { msg: 'No token, authorization denied' },
      { status: 401 }
    );
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  // Verify token
  try {
    const { payload, protectedHeader } = await jose.jwtVerify(token, secret);

    if (payload.user.id) {
      // add userId to cookie
      const response = NextResponse.next();
      response.cookies.set('userId', payload.user.id);
      
      return response;
    } else {
      return NextResponse.json({ msg: 'Token is not valid' }, { status: 401 });
    }
  } catch (err) {
    console.log('auth middleware error: ' + err);
    return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
  }
}
