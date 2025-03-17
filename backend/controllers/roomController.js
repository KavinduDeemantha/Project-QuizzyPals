const Room = require("../models/roomModel");
const User = require("../models/userModel");
const Quiz = require("../models/quizModel");

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

    res
      .status(StatusCodes.CREATED)
      .json({ roomId: room.roomId, host: user.email });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const joinRoomById = async (req, res) => {
  const { userEmail, roomId } = req.body;

  try {
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      throw Error(`Trying to join a room with an invalid user! ${userEmail}`);
    }

    const roomExist = await Room.findOne({ roomId: roomId });

    if (!roomExist) {
      throw Error(`There is no active room with the id: ${roomId}`);
    } else {
      user.roomId = roomId;
      await user.save();
    }

    const users = await User.find({ roomId: roomExist.roomId });

    for (let user of users) {
      user.score = 0;
      await user.save();
    }

    const host = await User.findOne({ userId: roomExist.host });

    if (!host) {
      const error = Error(
        "A room cannot existed without the user who created that!"
      );
      error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      throw error;
    }

    res.status(StatusCodes.OK).json({
      roomId: roomExist.roomId,
      host: host.email,
      saveData: roomExist.saveData,
    });
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || StatusCodes.BAD_REQUEST)
      .json({ message: error.message });
  }
};

const deleteRoomByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const host = await User.findOne({ userId });

    if (!host) {
      throw Error("Only the host can delete a room");
    }

    const room = await Room.findOne({ roomId: host.roomId });
    if (!room) {
      throw Error("You cannot delete unless it is not your room");
    }

    if (room.host != host._id) {
      throw Error("Only the host can delete rooms as he created!");
    }

    host.roomId = "";
    await host.save();

    const deleted = await Room.findOneAndDelete({ roomId: room.roomId });

    if (!deleted) {
      throw Error("The room cannot be deleted!");
    }

    await Quiz.deleteMany({ roomId: room.roomId });

    const users = await User.find({ roomId: room.roomId });
    for (let user of users) {
      user.roomId = null;
      await user.save();
    }

    res.status(StatusCodes.OK).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getRoomById = async (req, res) => {
  const roomId = req.params.roomId;

  try {
    const room = await Room.findById(roomId);

    res.status(StatusCodes.OK).json(room);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const getUsersByRoomId = async (req, res) => {
  const roomId = req.params.roomId;

  try {
    const users = await User.find({ roomId });

    if (!users) {
      throw Error(`There are no users assigned to this room: ${roomId}`);
    }

    const roomMates = [];
    for (let user of users) {
      roomMates.push({ email: user.email, score: user.score });
    }

    res.status(StatusCodes.OK).json(roomMates);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const getHostRoomId = async (req, res) => {
  const email = req.params.email;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw Error("User not found");
    }

    const room = await Room.findOne({ host: user._id });

    if (!room) {
      res.status(StatusCodes.OK).json({ roomId: null });
      return;
    }

    res.status(StatusCodes.OK).json({ roomId: room.roomId });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

module.exports = {
  createRoom,
  getRoomById,
  joinRoomById,
  deleteRoomByUserId,
  getUsersByRoomId,
  getHostRoomId
};
