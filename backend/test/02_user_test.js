const assert = require("assert");
const { it } = require("mocha");

let JWT = "1234";
let activeUserId = "1234";
let activeRoomId = "1234";
const userEmail = "damian@gmail.com";
const password = "12345678";

// Sign in user ✅
// router.post("/signin", signIn);

// Sign up user ✅
// router.post("/signup", signUp);

// Update a user ✅
// router.patch("/:id", updateUser);

// Delete a user ✅
// router.delete("/:email", deleteUser);

// Reset user password by user id ✅
// router.post("/reset-password/", resetPassword);

describe("User API", () => {
  it("Delete User - Damian", async () => {
    const userData = {
      email: userEmail,
      password: password,
    };

    const userExistsRequest = await fetch(
      "http://localhost:4000/api/users/signin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );
    const existingUser = await userExistsRequest.json();
    const userId = existingUser["userId"];

    if (userExistsRequest.status === 200 && userId) {
      await fetch(`http://localhost:4000/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          assert.strictEqual(res.status, 200);
          return res;
        })
        .catch((error) => {
          throw error;
        });
    }
  });

  it("Sign Up - Damian", async () => {
    const userData = {
      email: userEmail,
      password: "1234",
    };

    await fetch("http://localhost:4000/api/users/signup", {
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
        throw error;
      });
  });

  it("Delete User - Dinuka", async () => {
    const userData = {
      email: "john@gmail.com",
      password: "12345678",
    };

    const userExistsRequest = await fetch(
      "http://localhost:4000/api/users/signin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );
    const existingUser = await userExistsRequest.json();
    const userId = existingUser["userId"];

    if (userExistsRequest.status === 200 && userId) {
      await fetch(`http://localhost:4000/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          assert.strictEqual(res.status, 200);
          return res;
        })
        .catch((error) => {
          throw error;
        });
    }
  });

  it("Sign Up - Dinuka", async () => {
    const userData = {
      email: "john@gmail.com",
      password: "12345678",
    };

    await fetch("http://localhost:4000/api/users/signup", {
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
        throw error;
      });
  });

  it("Sign In - Damian", async () => {
    const userData = {
      email: userEmail,
      password: "1234",
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
        throw error;
      });
  });

  const updateUserData = {
    email: "test.email@test.com",
    password: "T-his-is-a-TesTinG-paSSWorD",
  };

  it("Update User: original -> fake", async () => {
    await fetch(`http://localhost:4000/api/users/${activeUserId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateUserData),
    })
      .then((res) => {
        assert.strictEqual(res.status, 200);
        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        assert.strictEqual(data.email, updateUserData.email);
        assert.strictEqual(data.userId, activeUserId);
      })
      .catch((error) => {
        throw error;
      });
  });

  it("Update User: fake -> original", async () => {
    await fetch(`http://localhost:4000/api/users/${activeUserId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: userEmail, password: password }),
    })
      .then((res) => {
        assert.strictEqual(res.status, 200);
        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        assert.strictEqual(data.email, userEmail);
        assert.strictEqual(data.userId, activeUserId);
      })
      .catch((error) => {
        throw error;
      });
  });

  it("Reset User Password", async () => {
    const userData = {
      email: userEmail,
      newPassword: "12345678",
    };

    await fetch("http://localhost:4000/api/users/reset-password", {
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
      })
      .catch((error) => {
        throw error;
      });
  });

  it("Check Resetted Password", async () => {
    const userData = {
      email: userEmail,
      password: "12345678",
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
        assert.notStrictEqual(data.userJWT, JWT);
        assert.strictEqual(data.email, userData.email);

        JWT = data.userJWT;
      })
      .catch((error) => {
        throw error;
      });
  });
});
