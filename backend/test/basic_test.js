const assert = require("assert");

describe("Authentication API", () => {
  it("Server is up and running!", () => {
    fetch("http://localhost:4000/")
      .then((res) => {
        assert.strictEqual(res.status, 200);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
