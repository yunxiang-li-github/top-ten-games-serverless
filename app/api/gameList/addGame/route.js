import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import TopTen from '@/models/TopTen';
import ajv from '@lib/customAjvKeyword';
import addGameSchema from '@schemas/addGame';
const validate = ajv.compile(addGameSchema);
import { getCoverImg } from '@/lib/igdb';

// @route    POST api/gameList/addGame
// @desc     Add a game to the game list
// @access   Private
export const POST = async (req) => {
  const body = await req.json();

  // validation
  const valid = validate(body);
  if (!valid) {
    return NextResponse.json(validate.errors, { status: 400 });
  }

  await dbConnect();

  try {
    // retrieve the user from cookie
    let userId = req.cookies.get('userId').value;

    const user = await User.findById(userId).select('-password');

    // if no user found
    if (!user) {
      return NextResponse.json({ msg: 'User not found' }, { status: 404 });
    }

    const gameList = await TopTen.findOne({ user: userId });

    // if the game already exists in the list, return an error
    if (
      gameList.topGames.filter(
        (game) => game.name.toLowerCase() === body.gameName.toLowerCase()
      ).length > 0
    ) {
      return NextResponse.json(
        { msg: 'Game already in the list' },
        { status: 400 }
      );
    }

    // fetch the game cover image URL
    const coverImageUrl = await getCoverImg(body.gameName);

    // add the game to the game list
    // rank is automatically added based on the number of games in the list, so it will always be the last one
    const newGame = {
      name: body.gameName,
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
    return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
  }
};
