// delete user
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import TopTen from "@/models/TopTen";

// @route    DELETE api/users
// @desc     Delete user
// @access   Private

export const DELETE = async (req) => {
  await dbConnect();

  try {
    // retrieve the user from cookie
    let userId = req.headers.get("userId");

    // remove the user's top ten list
    await Promise.all([TopTen.findOneAndRemove({ user: userId })]);

    // remove the user
    await Promise.all([User.findOneAndRemove({ _id: userId })]);

    return NextResponse.json({ msg: "User deleted" }, { status: 200 });
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
