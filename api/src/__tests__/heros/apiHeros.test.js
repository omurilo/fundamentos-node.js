const assert = require("assert");
const api = require("../../");

let app = {};

describe("hero api test suite", function () {
  this.beforeAll(async () => {
    app = await api;
  });

  it("list /heroes", async () => {
    const result = await app.inject({
      method: "GET",
      url: "/heroes",
    });

    const data = JSON.parse(result.payload);
    const { statusCode } = result;

    assert.deepEqual(statusCode, 200);
    assert.ok(Array.isArray(data));
  });

  it('list /heroes should return max 10 registers', async() => {
    const LENGTH_LIMIT = 10;
    const result = await app.inject({
      method: "GET",
      url: `/heroes?limit=${LENGTH_LIMIT}`,
    });

    const data = JSON.parse(result.payload);
    const { statusCode } = result;

    assert.deepEqual(statusCode, 200);
    assert.ok(data.length <= 10);
  });

  it('list /heroes should filter by name', async() => {
    const LENGTH_LIMIT = 10;
    const NAME = 'Goku';
    const result = await app.inject({
      method: "GET",
      url: `/heroes?limit=${LENGTH_LIMIT}&name=${NAME}`,
    });

    const data = JSON.parse(result.payload);
    const { statusCode } = result;

    assert.deepEqual(statusCode, 200);
    assert.deepEqual(data[0].name, NAME);
  });

  it('list /heroes should return error on validation parameters', async() => {
    const LENGTH_LIMIT = 'i5';
    const result = await app.inject({
      method: "GET",
      url: `/heroes?limit=${LENGTH_LIMIT}`,
    });

    const { statusCode } = result;

    assert.deepEqual(statusCode, 400);
  });

  it("create /hero", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/hero",
      payload: { name: "Super Shock", power: "Energy" },
    });

    const data = JSON.parse(result.payload);
    const { statusCode } = result;

    assert.deepEqual(statusCode, 200);
    assert.deepEqual(data["name"], "Super Shock");
  });
});
