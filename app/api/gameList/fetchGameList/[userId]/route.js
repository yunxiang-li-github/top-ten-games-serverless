import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import TopTen from '@/models/TopTen';

// @route    GET api/gameList/fetchGameList/:userId
// @desc     Fetch the game list of a user
// @access   Private
export const GET = async (req, { params }) => {
  // retrieve the user from params
  const userId = params.userId;

  await dbConnect();

  try {
    // verify if the user exists
    const user = await User.findById(userId);
    // if no user found in cookie, return an error
    if (!user) {
      return NextResponse.json({ msg: 'User not found' }, { status: 404 });
    }

    const gameList = await TopTen.findOne({ user: userId });

    return NextResponse.json(gameList, { status: 200 });
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
  }
};

// CORS preflight request handler
// hope vercel can fix this soon
export async function OPTIONS(request) {
  const origin = request.headers.get('origin');

  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
