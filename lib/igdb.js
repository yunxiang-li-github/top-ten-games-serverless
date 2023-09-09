import axios from 'axios';
import dbConnect from '@lib/dbConnect';
import GameForDB from '@/models/GameForDB';

// authenticate with twitch API to get access token
const auth = () => {
  const url = 'https://id.twitch.tv/oauth2/token';
  const body = `client_id=${process.env.IGDB_CLIENT_ID}&client_secret=${process.env.IGDB_CLIENT_SECRET}&grant_type=client_credentials`;

  return axios.post(url, body).then((response) => {
    console.log('access token ', response.data.access_token);
    return response.data.access_token;
  });
};

// retrieve game cover image URL from IGDB API
const getCoverImg = async (gameName) => {
  await dbConnect();

  // first check if the img is already in the database, if so then return it, otherwise call the API
  const result = await GameForDB.findOne({ name: gameName });

  if (result) {
    return result.ImageURL;
  }

  const accessToken = await auth();

  // other wise call the API
  const url = 'https://api.igdb.com/v4/games';
  const body = `search "${gameName}"; fields cover.image_id; limit 1;`;
  const headers = {
    'Client-ID': process.env.IGDB_CLIENT_ID,
    Authorization: `Bearer ${accessToken}`,
  };

  // use axios to send a POST request to retrieve img id which we can then put into URL to retrieve the img
  return axios
    .post(url, body, { headers })
    .then((response) => {
      // extract cover img id from response
      var coverImgId = response.data[0].cover.image_id;

      // put the img ID into URL so we can send it back
      var coverImageUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/${coverImgId}.jpg`;

      // store the game name and image URL to the database
      const newGameForDB = new GameForDB({
        name: gameName,
        ImageURL: coverImageUrl,
      });

      newGameForDB.save();

      //return img URL
      return coverImageUrl;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

export { getCoverImg };