import { NextResponse } from 'next/server';
import dbConnect from '@lib/dbConnect';
import User from '@models/User';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import ajv from '@lib/customAjvKeyword';
import loginSchema from '@schemas/login';
const validate = ajv.compile(loginSchema);

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
export const POST = async (req) => {
  const body = await req.json();

  // validate the user login form against the schema
  const valid = validate(body);
  if (!valid)
    return NextResponse.json({ error: validate.errors }, { status: 400 });

  const { email, password } = body;

  await dbConnect();

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { errors: [{ msg: 'Invalid Credentials' }] },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { errors: [{ msg: 'Invalid Credentials' }] },
        { status: 400 }
      );
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setIssuer('urn:example:issuer')
      .setAudience('urn:example:audience')
      .setExpirationTime('3h')
      .sign(secret);

    return NextResponse.json({ token: token }, { status: 200 });
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ msg: 'Server error' }, { status: 500 });
  }
};
