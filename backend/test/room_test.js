const assert = require("assert");

const JWT = "1234";
const activeRoomId = "1234";

describe("Room API", () => {
  it("Create Room", () => {
    const roomData = {
      host: "damian@gmail.com",
    };

    fetch("http://localhost:4000/api/rooms/createroom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
      body: JSON.stringify(roomData),
    })
      .then((res) => res.json())
      .then((data) => {
        assert.strictEqual(res.status, 200);
        assert.deepStrictEqual(data.roomName, "Test Room");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  it("Join Room", () => {
    const roomData = {
      userEmail: "damian@gmail.com",
      roomId: "6746fd0f4d49e500ca49af9a",
    };

    fetch("http://localhost:4000/api/rooms/createroom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
      body: JSON.stringify(roomData),
    })
      .then((res) => res.json())
      .then((data) => {
        assert.strictEqual(res.status, 200);
        assert.deepStrictEqual(data.roomName, "Test Room");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  it("Get Room Mates", () => {
    fetch(`http://localhost:4000/api/rooms/getroommates/${activeRoomId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        assert.strictEqual(res.status, 200);
        assert.deepStrictEqual(data.roomName, "Test Room");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
