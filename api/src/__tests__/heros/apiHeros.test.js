const assert = require("assert");
const api = require("../../");

let app = {};
const MOCK_HERO = { name: "Super Shock", power: "Energy" };

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

  it("list /heroes should return max 10 registers", async () => {
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

  it("list /heroes should filter by name", async () => {
    const LENGTH_LIMIT = 10;
    const NAME = "Goku";
    const result = await app.inject({
      method: "GET",
      url: `/heroes?limit=${LENGTH_LIMIT}&name=${NAME}`,
    });

    const data = JSON.parse(result.payload);
    const { statusCode } = result;

    assert.deepEqual(statusCode, 200);
    assert.deepEqual(data[0].name, NAME);
  });

  it("list /heroes should return error on validation parameters", async () => {
    const LENGTH_LIMIT = "i5";
    const result = await app.inject({
      method: "GET",
      url: `/heroes?limit=${LENGTH_LIMIT}`,
    });

    const { statusCode } = result;

    assert.deepEqual(statusCode, 400);
  });

  it("create /heroes", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/heroes",
      payload: MOCK_HERO,
    });

    const data = JSON.parse(result.payload);
    const { statusCode } = result;

    assert.deepEqual(statusCode, 200);
    assert.deepEqual(data["name"], "Super Shock");
  });

  it("update /heroes", async () => {
    const NAME = "Goku";
    const searchResult = await app.inject({
      method: "GET",
      url: `/heroes?name=${NAME}`,
    });

    const hero = JSON.parse(searchResult.payload);

    const result = await app.inject({
      method: "PATCH",
      url: `/heroes/${hero[0]._id}`,
      payload: { name: hero[0].name, power: "God" },
    });

    const { name, power } = JSON.parse(result.payload);
    const { statusCode } = result;

    assert.deepEqual(statusCode, 200);
    assert.deepEqual({ power, name }, { power: "God", name: hero[0].name });
  });

  it("delete /heroes should remove hero", async () => {
    const NAME = "gok";
    const searchResult = await app.inject({
      method: "GET",
      url: `/heroes?name=${NAME}`,
    });

    const hero = JSON.parse(searchResult.payload);

    const result = await app.inject({
      method: "DELETE",
      url: `/heroes/${hero[0]._id}`
    });

    const data = JSON.parse(result.payload);
    const { statusCode } = result;

    assert.deepEqual(statusCode, 200);
    assert.ok(data);
  });

  it("delete /heroes shouldn't remove hero with invalid id", async () => {
    const _id = 'ID_INVALIDO';
    const result = await app.inject({
      method: "DELETE",
      url: `/heroes/${_id}`
    });

    const data = JSON.parse(result.payload);
    const { statusCode } = result;
    const expected = {
      statusCode: 500,
      message: 'An internal server error occurred',
      error: 'Internal Server Error',
    }
    assert.deepEqual(statusCode, 500);
    assert.deepEqual(data, expected);
  });
});
