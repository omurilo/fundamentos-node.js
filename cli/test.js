const { deepEqual, ok } = require("assert");
const database = require("./database");

const DEFAULT_ITEM_SAVE = { name: "Flash", power: "speed", id: 1 };
const DEFAULT_ITEM_UPDATE = {
  name: "Green Lantern",
  power: "Energy of Ring",
  id: 2
};

describe("Hero Manipulation Suite", () => {
  before(async () => {
    await database.store(DEFAULT_ITEM_SAVE);
    await database.store(DEFAULT_ITEM_UPDATE);
  });

  it("should search a hero using archives", async () => {
    const expected = DEFAULT_ITEM_SAVE;
    const [result] = await database.search(expected.id);
    deepEqual(result, expected);
  });

  it("should save a hero using archives", async () => {
    const expected = DEFAULT_ITEM_SAVE;
    await database.store(expected);
    const [actual] = await database.search(expected.id);

    deepEqual(actual, expected);
  });

  it("should remove a hero by id", async () => {
    const expected = true;
    const result = await database.remove(DEFAULT_ITEM_SAVE.id);

    deepEqual(result, expected);
  });

  it("should update a hero", async () => {
    const newData = { name: "Batman", power: "Money" };
    const expected = { ...DEFAULT_ITEM_UPDATE, ...newData };
    await database.update(expected.id, newData);
    const [actual] = await database.search(expected.id);

    deepEqual(actual, expected);
  });
});
