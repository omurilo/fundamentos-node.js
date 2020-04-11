const assert = require("assert");
const api = require("../../");

let app = {};
const MOCK_HERO_REGISTER = { name: "Super Shock", power: "Energy" };
const MOCK_HERO_INITIAL = {
  name: "Chapolin Colorado",
  power: "Marreta Bionica",
};
const MOCK_NONEXISTENT_ID = "5e90afa08ad23212c8ec42fc";
let MOCK_ID = "";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inh1eGFkYSIsImlkIjoxLCJpYXQiOjE1ODY1Njc3NjB9.JAwJPdqD4rW1Bgb0ZexM7gG0lL_R9r74XeR-mIt2MJw";

const headers = {
  authorization: TOKEN,
};

describe("hero api test suite", function () {
  this.beforeAll(async () => {
    app = await api;
    const result = await app.inject({
      method: "POST",
      url: "/heroes",
      headers,
      payload: MOCK_HERO_INITIAL,
    });

    const data = JSON.parse(result.payload);
    MOCK_ID = data._id;
  });

  it("list /heroes", async () => {
    const result = await app.inject({
      method: "GET",
      url: "/heroes",
      headers,
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
      headers,
    });

    const data = JSON.parse(result.payload);
    const { statusCode } = result;

    assert.deepEqual(statusCode, 200);
    assert.ok(data.length <= 10);
  });

  it("list /heroes should filter by name", async () => {
    const LENGTH_LIMIT = 10;
    const result = await app.inject({
      method: "GET",
      url: `/heroes?limit=${LENGTH_LIMIT}&name=${MOCK_HERO_INITIAL.name}&power=${MOCK_HERO_INITIAL.power}`,
      headers,
    });

    const data = JSON.parse(result.payload);
    const { statusCode } = result;

    assert.deepEqual(statusCode, 200);
    assert.deepEqual(data[0].name, MOCK_HERO_INITIAL.name);
  });

  it("list /heroes should return error on validation parameters", async () => {
    const LENGTH_LIMIT = "i5";
    const result = await app.inject({
      method: "GET",
      url: `/heroes?limit=${LENGTH_LIMIT}`,
      headers,
    });

    const { statusCode } = result;

    assert.deepEqual(statusCode, 400);
  });

  it("create /heroes", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/heroes",
      payload: MOCK_HERO_REGISTER,
      headers,
    });

    const data = JSON.parse(result.payload);
    const { statusCode } = result;

    assert.deepEqual(statusCode, 200);
    assert.deepEqual(data["name"], "Super Shock");
  });

  it("update /heroes", async () => {
    const result = await app.inject({
      method: "PATCH",
      url: `/heroes/${MOCK_ID}`,
      payload: { power: "God" },
      headers,
    });

    const { name, power } = JSON.parse(result.payload);
    const { statusCode } = result;

    assert.deepEqual(statusCode, 200);
    assert.deepEqual(
      { power, name },
      { power: "God", name: MOCK_HERO_INITIAL.name }
    );
  });

  it("update /heroes shouldn't update hero with id not exist", async () => {
    const result = await app.inject({
      method: "PATCH",
      url: `/heroes/${MOCK_NONEXISTENT_ID}`,
      payload: { power: "God" },
      headers,
    });

    const data = JSON.parse(result.payload);
    const { statusCode } = result;
    const expected = {
      statusCode: 412,
      error: "Precondition Failed",
      message: "Hero id not exist",
    };
    assert.deepEqual(statusCode, 412);
    assert.deepEqual(data, expected);
  });

  it("delete /heroes should remove hero", async () => {
    const result = await app.inject({
      method: "DELETE",
      url: `/heroes/${MOCK_ID}`,
      headers,
    });

    const data = JSON.parse(result.payload);
    const { statusCode } = result;

    assert.deepEqual(statusCode, 200);
    assert.ok(data);
  });

  it("delete /heroes shouldn't remove hero with id not exist", async () => {
    const result = await app.inject({
      method: "DELETE",
      url: `/heroes/${MOCK_NONEXISTENT_ID}`,
      headers,
    });

    const data = JSON.parse(result.payload);
    const { statusCode } = result;
    const expected = {
      statusCode: 412,
      error: "Precondition Failed",
      message: "Hero id not exist",
    };
    assert.deepEqual(statusCode, 412);
    assert.deepEqual(data, expected);
  });

  it("delete /heroes shouldn't remove hero with invalid id", async () => {
    const _id = `${MOCK_NONEXISTENT_ID}1`;
    const result = await app.inject({
      method: "DELETE",
      url: `/heroes/${_id}`,
      headers,
    });

    const data = JSON.parse(result.payload);
    const { statusCode } = result;
    const expected = {
      statusCode: 500,
      message: "An internal server error occurred",
      error: "Internal Server Error",
    };
    assert.deepEqual(statusCode, 500);
    assert.deepEqual(data, expected);
  });
});
