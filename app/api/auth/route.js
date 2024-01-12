import { NextResponse } from "next/server";
import dbConnect from "@lib/dbConnect";
import User from "@models/User";

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
export const GET = async (req) => {
  await dbConnect();
  try {
    let userId = req.headers.get("userId");
    const user = await User.findById(userId).select("-password");
    return NextResponse.json(user);
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
