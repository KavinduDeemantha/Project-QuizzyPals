const Room = require("../models/roomModel");
const User = require("../models/userModel");

const { StatusCodes } = require("http-status-codes");

const createRoom = async (req, res) => {
  const { host } = req.body;

  try {
    const user = await User.findOne({ email: host });

    if (!user) {
      throw Error("Trying to create a room with an invalid user!");
    }

    const roomExist = await Room.findOne({ host: user._id });

    if (roomExist) {
      throw Error(
        `A single user can't create two or more rooms! Your room id is: ${roomExist.roomId}`
      );
    }

    const room = await Room.create({ roomId: 0, host: user._id });
    room.roomId = room._id;
    await room.save();

    if (room) {
      user.roomId = room.roomId;
      await user.save();
    }

    res.status(StatusCodes.CREATED).json(room);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
  }
};

const joinRoomById = async (req, res) => {
  const { userEmail, roomId } = req.body;

  try {
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      throw Error("Trying to join a room with an invalid user!");
    }

    const roomExist = await Room.findOne({ roomId: roomId });

    if (!roomExist) {
      throw Error(`There is no active room with the id: ${roomId}`);
    } else {
      user.roomId = roomId;
      await user.save();
    }

    res.status(StatusCodes.OK).json(roomExist);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
  }
};

const getRoomById = async (req, res) => {
  const roomId = req.params.roomId;

  try {
    const room = await Room.findById(roomId);

    res.status(StatusCodes.OK).json(room);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
  }
};

module.exports = {
  createRoom,
  getRoomById,
  joinRoomById,
};
