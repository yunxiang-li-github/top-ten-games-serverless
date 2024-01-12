import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

// @route    POST api/users/updateProfile
// @desc     update user profile
// @access   Private
export const POST = async (req) => {
  const body = await req.json();
  const { name, picId, bio } = body;

  await dbConnect();

  try {
    // retrieve the user from headers
    let userId = req.headers.get("userId");

    const user = await User.findById(userId).select("-password");
    // if no user found in cookie, return an error
    if (!user) {
      return NextResponse.json({ errors: ["User not found"] }, { status: 404 });
    }

    // update user profile
    if (name) user.name = name;
    if (picId) user.profilePicId = picId;
    if (bio) user.profileBio = bio;

    await user.save();

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ errors: ["Server Error"] }, { status: 500 });
  }
};

// CORS preflight request handler
// hope vercel can fix this soon
export async function OPTIONS(request) {
  const origin = request.headers.get("origin");

  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin || "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
