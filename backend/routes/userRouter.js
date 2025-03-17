const express = require("express");

const router = express.Router();

const {
  signIn,
  updateUser,
  deleteUser,
  signUp,
  getUserRoomId,
  resetPassword,
  getUser,
} = require("../controllers/userController");

// Sign in user
router.post("/signin", signIn);

// Sign up user
router.post("/signup", signUp);

// Update a user
router.patch("/:id", updateUser);

// Delete a user
router.delete("/:userId", deleteUser);

// Get user room id
router.get("/roomid/:email", getUserRoomId);

router.get("/", getUserRoomId);

// Reset password
router.post("/reset-password/", resetPassword);

// Get user by host
router.post("/get-user", getUser);

module.exports = router;
