import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import TopTen from "@/models/TopTen";

// @route    GET api/gameList/getGameList
// @desc     Get the game list for current user
// @access   Private
export const GET = async (req) => {
  await dbConnect();

  try {
    // retrieve the user from headers
    let userId = req.headers.get("userId");

    const user = await User.findById(userId).select("-password");
    // if no user found in cookie, return an error
    if (!user) {
      return NextResponse.json({ errors: ["User not found"] }, { status: 404 });
    }

    const gameList = await TopTen.findOne({ user: userId });

    // add user name to the output
    const gameListObj = gameList.toObject();
    gameListObj.userName = user.name;

    return NextResponse.json(gameListObj, { status: 200 });
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
