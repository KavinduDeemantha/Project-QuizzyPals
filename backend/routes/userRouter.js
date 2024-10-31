const express = require("express");

const router = express.Router();

const {
  signIn,
  updateUser,
  deleteUser,
  signUp,
  getUserRoomId,
} = require("../controllers/userController");

// Sign in user
router.post("/signin", signIn);

// Sign up user
router.post("/signup", signUp);

// Update a user
router.patch("/:id", updateUser);

// Delete a user
router.delete("/:id", deleteUser);

// Get user room id
router.get("/roomid/:email", getUserRoomId);

module.exports = router;
