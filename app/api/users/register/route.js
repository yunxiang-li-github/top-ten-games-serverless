import { NextResponse } from 'next/server';
import dbConnect from '@lib/dbConnect';
import User from '@models/User';
import TopTen from '@models/TopTen';
import bcrypt from 'bcryptjs';
import ajv from '@lib/customAjvKeyword';
import registerSchema from '@schemas/register';
const validate = ajv.compile(registerSchema);

// @route    POST api/users/register
// @desc     Register user
// @access   Public
export const POST = async (req) => {
  const body = await req.json();

  // validate the user register form against the schema
  const valid = validate(body);
  if (!valid)
    return NextResponse.json({ error: validate.errors }, { status: 400 });

  await dbConnect();

  try {
    const { name, email, password } = body;

    let user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        {
          errors: [{ msg: 'User already exists' }],
        },
        { status: 400 }
      );
    }

    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // create empty top ten list for the user
    const topTen = {
      user: user.id,
      topGames: [],
    };

    const newTopTen = new TopTen(topTen);
    await newTopTen.save();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
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
