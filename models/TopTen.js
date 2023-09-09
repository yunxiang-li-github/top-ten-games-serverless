const mongoose = require('mongoose');

const TopTenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  topGames: [
    {
      name: {
        type: String,
        required: true,
      },
      gameCoverURL: {
        type: String,
      },
      reviewDescription: {
        type: String,
      },
      rank: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.models.TopTen || mongoose.model('TopTen', TopTenSchema);
