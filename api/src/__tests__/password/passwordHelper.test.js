const assert = require("assert");
const PasswordHelper = require("../../helpers/PasswordHelper");

const PASSWORD = "Murilo@311321233212";
const HASH = "$2b$08$t3LfSEMHsP5ldqI415wQeOAzj0aSgy.arve/2sTkVxk8xZEABh.pu";

describe("Password helper suite", function () {
  it("should be hash a password", async () => {
    const result = await PasswordHelper.generateHash(PASSWORD);

    assert.ok(result.length > 10);
  });

  it("should be compare hash", async () => {
    const result = await PasswordHelper.compareHash(PASSWORD, HASH);

    assert.ok(result);
  })
});
