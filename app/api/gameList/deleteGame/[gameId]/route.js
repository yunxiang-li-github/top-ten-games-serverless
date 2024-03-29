import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import TopTen from "@/models/TopTen";

// @route    POST api/gameList/deleteGame/:gameId
// @desc     Delete a game from the game list
// @access   Private
export const POST = async (req, { params }) => {
  const gameId = params.gameId;

  await dbConnect();

  try {
    // retrieve the user from cookie
    let userId = req.headers.get("userId");
    const user = await User.findById(userId).select("-password");
    // if no user found in cookie, return an error
    if (!user) {
      return NextResponse.json({ errors: ["User not found"] }, { status: 404 });
    }

    const gameList = await TopTen.findOne({ user: userId });

    const game = await gameList.topGames.find((game) => game.id === gameId);

    // if the game is not in the list, return an error
    if (!game) {
      return NextResponse.json({ errors: ["Game not found"] }, { status: 404 });
    }

    // remove the game from the list
    gameList.topGames = gameList.topGames.filter((game) => game.id !== gameId);

    // reassign the rank for the remaining games
    gameList.topGames.forEach((game, index) => {
      game.rank = index + 1;
    });

    await gameList.save();

    return NextResponse.json(
      { msg: "Game removed from list" },
      { status: 200 }
    );
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
