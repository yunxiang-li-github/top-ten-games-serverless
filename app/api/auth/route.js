import { NextResponse } from 'next/server';
import dbConnect from '@lib/dbConnect';
import User from '@models/User';

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
export const GET = async (req) => {
  await dbConnect();
  try {
    let userId = req.cookies.get('userId').value;
    const user = await User.findById(userId).select('-password');
    return NextResponse.json(user);
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
  }
};
