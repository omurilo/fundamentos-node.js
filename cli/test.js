const { deepEqual, ok } = require("assert");
const database = require("./database");

const DEFAULT_ITEM_SAVE = { name: "Flash", power: "speed", id: 1 };

describe("Hero Manipulation Suite", () => {
  before(async () => {
    await database.save(DEFAULT_ITEM_SAVE);
  });

  it("should search a hero using archives", async () => {
    const expected = DEFAULT_ITEM_SAVE;
    const [result] = await database.search(expected.id);
    deepEqual(result, expected);
  });

  it("should save a hero using archives", async () => {
    const expected = { id: 2, name: "Batman", power: "Be a Rich" };
    await database.save(expected);
    const [actual] = await database.search(expected.id);

    deepEqual(actual, expected);
  });

  it("should remove a hero by id", async () => {
    const expected = true;
    const result = await database.remove(DEFAULT_ITEM_SAVE.id);

    deepEqual(result, expected);
  })
});
