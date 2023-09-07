import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
// instead of using express-validator, we use ajv
import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true });
require('ajv-errors')(ajv /*, {singleError: true} */);

// add custom keyword to ajv to check if the string is not empty (strange that ajv doesn't have this built-in)
ajv.addKeyword('isNotEmpty', {
  type: 'string',
  validate: function (schema, data) {
    return typeof data === 'string' && data.trim() !== '';
  },
  errors: false,
});

// this user schema is used to validate the user input using ajv
const userAjvSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      isNotEmpty: true,
      errorMessage: {
        isNotEmpty: 'Name is required',
      },
    },
    email: {
      type: 'string',
      isNotEmpty: true,
      errorMessage: {
        isNotEmpty: 'Email is required',
      },
    },
    password: {
      type: 'string',
      minLength: 6,
      isNotEmpty: true,
      errorMessage: {
        isNotEmpty: 'Password is required',
        minLength: 'Password must be at least 6 characters',
      },
    },
  },
  required: ['name', 'email', 'password'],
  additionalProperties: false,
};
const validate = ajv.compile(userAjvSchema);

// @route    POST api/users
// @desc     Register user
// @access   Public
export const POST = async (req) => {
  const body = await req.json();
  console.log('req.body', body);

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

    // await user.save();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
};
