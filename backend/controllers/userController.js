const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const createJWT = (id) => {
  return jwt.sign({ id }, process.env.SUPER_SECRET, { expiresIn: "5d" });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.signin(email, password);

    const userJWT = createJWT(user._id);

    res.status(200).json({ email, userJWT });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const signUp = async (req, res) => {
  const { email, password } = req.body;

  try {
    const newUser = await User.signup(email, password);

    const userJWT = createJWT(newUser._id);

    res.status(200).json({ email, userJWT });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "User not found" });
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
    res.status(400).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.remove();
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  signIn,
  signUp,
  updateUser,
  deleteUser,
};
