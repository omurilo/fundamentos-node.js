const assert = require("assert");
const MongoDB = require("../../db/strategies/mongodb");
const HeroSchema = require("../../db/strategies/mongodb/schemas/heroSchema");
const Context = require("../../db/strategies/base/context/strategy");

const MOCK_HERO_STORE = { name: "Hawkman ", power: "Arrows" };
let MOCK_HERO_DELETED_ID = "";

let mongodbContext = {};

describe("MongoDB test", function () {
  it("should connect to MongoDB", async () => {
    const connection = await MongoDB.connect();
    mongodbContext = new Context(new MongoDB(connection, HeroSchema));
  });
  this.timeout(Infinity);

  it("should verify if is connected to MongoDB", async function () {
    const result = await mongodbContext.isConnected();

    assert.equal(result, true);
  });

  it("should be store a hero", async function () {
    const { _id, name, power } = await mongodbContext.store(MOCK_HERO_STORE);
    MOCK_HERO_DELETED_ID = _id;
    assert.deepEqual({ name, power }, MOCK_HERO_STORE);
  });

  it("should be list a heroes", async function () {
    const [{ name, power }] = await mongodbContext.index({
      name: MOCK_HERO_STORE.name,
    });
    assert.deepEqual({ name, power }, MOCK_HERO_STORE);
  });

  it("should be search a hero by id", async function () {
    const [{ name, power }] = await mongodbContext.index({
      name: MOCK_HERO_STORE.name,
    });
    assert.deepEqual({ name, power }, MOCK_HERO_STORE);
  });

  it("should be update a hero by id", async function () {
    const newItem = { ...MOCK_HERO_STORE, name: "Goku" };
    const { name } = await mongodbContext.update(MOCK_HERO_DELETED_ID, newItem);
    assert.deepEqual(name, newItem.name);
  });

  it("should be delete a hero by id", async function () {
    const result = await mongodbContext.delete(MOCK_HERO_DELETED_ID);
    assert.equal(result, true);
  });
});
