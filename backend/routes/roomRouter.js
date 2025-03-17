const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const {
  createRoom,
  getRoomById,
  joinRoomById,
  deleteRoomByUserId,
  getUsersByRoomId,
  getHostRoomId,
} = require("../controllers/roomController");

const router = express.Router();

router.use(requireAuth);

// Create new room
router.post("/createroom", createRoom);

// Get room of the user
router.get("/getroom/:roomId", getRoomById);

// Join to a room by id
router.post("/joinroom", joinRoomById);

// Delete room by id
router.delete("/deleteroom/:userId", deleteRoomByUserId);

// Get users by room id
router.get("/getroommates/:roomId", getUsersByRoomId);

// Get host room id
router.get("/hostroomid/:email", getHostRoomId);

module.exports = router;
