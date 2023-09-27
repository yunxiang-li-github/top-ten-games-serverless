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

      if (request.nextUrl.pathname.startsWith("/api")) {
        response.headers.append("Access-Control-Allow-Origin", "*")
      }
      
      return response;
    } else {
      return NextResponse.json({ msg: 'Token is not valid' }, { status: 401 });
    }
  } catch (err) {
    console.log('auth middleware error: ' + err);
    return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
  }
}
