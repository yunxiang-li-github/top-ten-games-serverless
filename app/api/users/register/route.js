import { NextResponse } from 'next/server';
import dbConnect from '@lib/dbConnect';
import User from '@models/User';
import bcrypt from 'bcryptjs';
import ajv from '@lib/customAjvKeyword';
import registerSchema from '@schemas/register';
const validate = ajv.compile(registerSchema);

// @route    POST api/users
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

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
};
