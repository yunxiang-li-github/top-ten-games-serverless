// delete user
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import TopTen from '@/models/TopTen';

// @route    DELETE api/users
// @desc     Delete user
// @access   Private

export const DELETE = async (req) => {
  await dbConnect();

  try {
    // retrieve the user from cookie
    let userId = req.cookies.get('userId').value;

    // remove the user
    await Promise.all([User.findOneAndRemove({ _id: userId })]);

    return NextResponse.json({ msg: 'User deleted' }, { status: 200 });
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
  }
};
