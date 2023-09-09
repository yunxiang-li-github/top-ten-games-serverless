const mongoose = require('mongoose');

// store game name and image URL to database
const GameForDBSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ImageURL: {
    type: String,
  },
});

module.exports = mongoose.models.GameForDB || mongoose.model('GameForDB', GameForDBSchema);