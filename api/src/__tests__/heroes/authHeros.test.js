const assert = require("assert");
const api = require("../../");
const Context = require("../../db/strategies/base/context/strategy");
const PostgreSQL = require("../../db/strategies/postgres");
const UserSchema = require("../../db/strategies/postgres/schemas/userSchema");

let app = {};

const USER = {
  username: "XuXaDa",
  password: "123",
};

const USER_DB = {
  username: USER.username.toLowerCase(),
  password: "$2b$08$YeQCj7tm.H3/3/YOLEcCreVs4tex9xRhZUlo1slhWblaTeGW0RlTq",
};

describe("Auth test suite", function () {
  this.beforeAll(async () => {
    app = await api;
    const connection = await PostgreSQL.connect();
    const model = await PostgreSQL.defineModel(connection, UserSchema);
    const context = new Context(new PostgreSQL(connection, model));

    await context.update(null, USER_DB, true);
  });

  it("should be get token", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/auth",
      payload: USER,
    });

    const { statusCode } = result;
    const data = JSON.parse(result.payload);

    assert.deepEqual(statusCode, 200);
    assert.ok(data.token.length >= 10);
  });
});
