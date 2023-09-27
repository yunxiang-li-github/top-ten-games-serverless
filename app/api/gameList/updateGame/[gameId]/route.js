import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import TopTen from '@/models/TopTen';

// @route    POST api/gameList/updateGame/:gameId
// @desc     Update a game in the game list
// @access   Private
export const POST = async (req, { params }) => {
  const body = await req.json();
  const gameId = params.gameId;

  await dbConnect();

  try {
    // retrieve the user from cookie
    let userId = req.headers.get('userId');
    const user = await User.findById(userId).select('-password');
    // if no user found
    if (!user) {
      return NextResponse.json({ msg: 'User not found' }, { status: 404 });
    }

    const gameList = await TopTen.findOne({ user: userId });

    // if the game does not exist in the list, return an error
    if (gameList.topGames.filter((game) => game._id == gameId).length === 0) {
      return NextResponse.json(
        { msg: 'Game not found in the list' },
        { status: 404 }
      );
    }

    // find the game to update
    const gameToUpdate = gameList.topGames.find((game) => game._id == gameId);

    // update the game
    gameToUpdate.rank = body.rank || gameToUpdate.rank;
    gameToUpdate.reviewDescription =
      body.reviewDescription || gameToUpdate.reviewDescription;

    // move the index of the updated game based on the new rank
    const oldIndex = gameList.topGames.indexOf(gameToUpdate);
    const newIndex = gameToUpdate.rank - 1;
    gameList.topGames.splice(oldIndex, 1);
    gameList.topGames.splice(newIndex, 0, gameToUpdate);
    // reassign the rank for the remaining games
    gameList.topGames.forEach((game, index) => {
      game.rank = index + 1;
    });

    // save the game list
    await gameList.save();

    return NextResponse.json({ msg: 'Game updated' }, { status: 200 });
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
  }
};

// CORS preflight request handler
// hope vercel can fix this soon
export async function OPTIONS(request) {
  const origin = request.headers.get('origin');

  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
