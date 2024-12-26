const assert = require("assert");

let JWT = "1234";
let activeUserId = "1234";
let activeRoomId = "1234";
const userEmail = "chamel@gmail.com";
const password = "12345678";

describe("Room API", () => {
  before("Sign In", async () => {
    const userData = {
      email: userEmail,
      password: password,
    };

    await fetch("http://localhost:4000/api/users/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((res) => {
        assert.strictEqual(res.status, 200);
        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        assert.notStrictEqual(data.userJWT, "");

        JWT = data.userJWT;
        activeUserId = data.userId;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  after("Delete Room", async () => {
    await fetch(`http://localhost:4000/api/rooms/deleteroom/${activeUserId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
    })
      .then((res) => {
        assert.strictEqual(res.status, 200);
        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        assert.strictEqual(data.message, "Room deleted successfully");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  it("Create Room", async () => {
    const roomData = {
      host: userEmail,
    };

    await fetch("http://localhost:4000/api/rooms/createroom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
      body: JSON.stringify(roomData),
    })
      .then((res) => {
        assert.strictEqual(res.status, 201);

        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        assert.strictEqual(data.host, userEmail);

        activeRoomId = data.roomId;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  it("Join Room", () => {
    const roomData = {
      userEmail: userEmail,
      roomId: activeRoomId,
    };

    fetch("http://localhost:4000/api/rooms/joinroom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
      body: JSON.stringify(roomData),
    })
      .then((res) => {
        assert.strictEqual(res.status, 200);

        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        assert.strictEqual(data.roomId, activeRoomId);
        assert.strictEqual(data.host, userEmail);
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
      .then((res) => {
        assert.strictEqual(res.status, 200);

        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        assert.notStrictEqual(data, null);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  it("Get Room Data", () => {
    fetch(`http://localhost:4000/api/rooms/getroom/${activeRoomId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
    })
      .then((res) => {
        assert.strictEqual(res.status, 200);

        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        assert.strictEqual(data.roomId, activeRoomId);
        assert.strictEqual(data.host, activeUserId);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
