const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Room = require("../models/roomModel");
const { StatusCodes } = require("http-status-codes");

const createJWT = (id) => {
  return jwt.sign({ id }, process.env.SUPER_SECRET, { expiresIn: "5d" });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body);

  try {
    const user = await User.signin(email, password);

    const userJWT = createJWT(user._id);

    res
      .status(StatusCodes.OK)
      .json({ email: email, userId: user._id, userJWT: userJWT });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const signUp = async (req, res) => {
  const { email, password } = req.body;

  try {
    const newUser = await User.signup(email, password);

    const userJWT = createJWT(newUser._id);

    res
      .status(StatusCodes.OK)
      .json({ email: newUser.email, userId: newUser._id, userJWT: userJWT });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user == null) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }

    if (req.body.password != null) {
      await User.reset_password(user.email, req.body.password);
    }
    if (req.body.email != null) {
      user.email = req.body.email;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const deleted = await User.findOneAndDelete({ userId });
    if (!deleted) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "User not deleted" });
      return;
    }

    res.json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// const deleteUserByHost = async (req, res) => {
//   const { hostId, targetUserEmail } = req.body;

//   try {
//     const host = await User.find({ userId: hostId });
//     if (!host) {
//       throw Error(`You are not the host`);
//     }

//     const room = await Room.find({ roomId: host.roomId });
//     if (!room) {
//       throw Error(`Only host can delete other users`);
//     }

//     const targetUser = await User.findOneAndDelete({ email: targetUserEmail });
//     if (!targetUser) {
//       throw Error(`No such user found`);
//     }
//   } catch (error) {
//     console.error(error);
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ message: error.message });
//   }
// };

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const updatedUser = await User.reset_password(email, newPassword);

    res.status(StatusCodes.OK).json(updatedUser);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getUserRoomId = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
      return;
    }

    res.json({ roomId: user.roomId });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  const { hostId, targetUserEmail } = req.body;

  try {
    const host = await User.find({ userId: hostId });
    if (!host) {
      throw Error(`You are not the host`);
    }

    const room = await Room.find({ roomId: host.roomId });
    if (!room) {
      throw Error(`Only host can delete other users`);
    }

    const targetUser = await User.findOne({ email: targetUserEmail });
    if (!targetUser) {
      throw Error(`No such user found`);
    }

    res.status(StatusCodes.OK).json({ userId: targetUser.userId });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

module.exports = {
  signIn,
  signUp,
  updateUser,
  deleteUser,
  getUserRoomId,
  resetPassword,
  getUser,
};
