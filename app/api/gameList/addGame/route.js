import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import TopTen from "@/models/TopTen";
import ajv from "@lib/customAjvKeyword";
import addGameSchema from "@schemas/addGame";
const validate = ajv.compile(addGameSchema);
import { getCoverImg } from "@/lib/igdb";

// @route    POST api/gameList/addGame
// @desc     Add a game to the game list
// @access   Private
export const POST = async (req) => {
  const body = await req.json();

  // validation
  const valid = validate(body);
  if (!valid) {
    return NextResponse.json({ errors: validate.errors }, { status: 400 });
  }

  await dbConnect();

  try {
    // retrieve the user from cookie
    let userId = req.headers.get("userId");

    const user = await User.findById(userId).select("-password");

    // if no user found
    if (!user) {
      return NextResponse.json({ errors: "User not found" }, { status: 404 });
    }

    const gameList = await TopTen.findOne({ user: userId });

    // if the game already exists in the list, return an error
    if (
      gameList.topGames.filter(
        (game) => game.name.toLowerCase() === body.gameName.toLowerCase()
      ).length > 0
    ) {
      return NextResponse.json(
        { errors: "Game already in the list" },
        { status: 400 }
      );
    }

    // if the gameList already has ten games, return an error
    if (gameList.topGames.length >= 10) {
      return NextResponse.json(
        { msg: "Game list already has 10 games" },
        { status: 400 }
      );
    }

    // fetch the game cover image URL
    const coverImageUrl = await getCoverImg(body.gameName);

    // make name first letter uppercase in every word and the rest lowercase
    const gameName = body.gameName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    // add the game to the game list
    // rank is automatically added based on the number of games in the list, so it will always be the last one
    const newGame = {
      name: gameName,
      gameCoverURL: coverImageUrl,
      reviewDescription: body.reviewDescription,
      rank: gameList.topGames.length + 1,
    };

    gameList.topGames.push(newGame);

    // save the game list
    await gameList.save();

    return NextResponse.json(gameList.topGames);
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ msg: "Server Error" }, { status: 500 });
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
