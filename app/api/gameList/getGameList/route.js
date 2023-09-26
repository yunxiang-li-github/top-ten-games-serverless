import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import TopTen from '@/models/TopTen';

// @route    GET api/gameList/getGameList
// @desc     Get the game list
// @access   Private
export const GET = async (req) => {
  await dbConnect();

  try {
    // retrieve the user from cookie
    let userId = req.cookies.get('userId').value;
    const user = await User.findById(userId).select('-password');
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
}