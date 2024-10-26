const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  host: {
    type: String,
    required: true,
  },
  gameRound: {
    type: Number,
    required: false,
  },
  gameStart: {
    type: Date,
    required: false,
  },
  gameEnd: {
    type: Date,
    required: false,
  },
});

module.exports = mongoose.model("Room", roomSchema);
