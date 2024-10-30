const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");

const createJWT = (id) => {
  return jwt.sign({ id }, process.env.SUPER_SECRET, { expiresIn: "5d" });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.signin(email, password);

    const userJWT = createJWT(user._id);

    res
      .status(StatusCodes.OK)
      .json({ email: email, userId: user._id, userJWT: userJWT });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message });
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
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user == null) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }

    if (req.body.username != null) {
      user.username = req.body.username;
    }
    if (req.body.email != null) {
      user.email = req.body.email;
    }
    if (req.body.age != null) {
      user.age = req.body.age;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findOneAndDelete({ email: req.params.email });
    if (!deleted) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "User not deleted" });
      return;
    }

    res.json({ message: "User deleted" });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message });
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
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message });
  }
};

module.exports = {
  signIn,
  signUp,
  updateUser,
  deleteUser,
  getUserRoomId,
};
