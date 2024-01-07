import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

// @route    POST api/users/fetch
// @desc     Fetch all users with vague user name input
// @access   Private
export const POST = async (req) => {
  const body = await req.json();
  const { name } = body;

  await dbConnect();

  try {
    const regex = new RegExp(name, "i");

    const user = await User.find({ name: regex });

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ errors: "Server error" }, { status: 500 });
  }
};
