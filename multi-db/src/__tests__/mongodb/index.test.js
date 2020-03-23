const assert = require("assert");
const MongoDB = require("../../db/strategies/mongodb");
const HeroSchema = require('../../db/strategies/mongodb/schemas/heroSchema');
const Context = require("../../db/strategies/base/context/strategy");

const MOCK_HERO_STORE = { name: "Hawkman ", power: "Arrows" };
const MOCK_HERO_UPDATE = { name: "Batman ", power: "Money" };

let mongodbContext = {};

describe("MongoDB test", function() {
  this.beforeAll(async function() {
    const connection = MongoDB.connect();
    mongodbContext = new Context(new MongoDB(connection, HeroSchema));
    await mongodbContext.delete();
    await mongodbContext.store(MOCK_HERO_UPDATE);
  });

  this.timeout(Infinity);
  it("should connect to MongoDB", async function() {
    const result = await mongodbContext.isConnected();

    assert.equal(result, true);
  });

  it("should be store a hero", async function() {
    const { name, power } = await mongodbContext.store(MOCK_HERO_STORE);
    assert.deepEqual({ name, power }, MOCK_HERO_STORE);
  });

  it("should be list a heros", async function() {
    const [{ name, power }] = await mongodbContext.index(
      {
        name: MOCK_HERO_STORE.name
      },
      0,
      1
    );
    assert.deepEqual({ name, power }, MOCK_HERO_STORE);
  });

  it("should be search a hero by id", async function() {
    const [{ name, power }] = await mongodbContext.index(
      {
        name: MOCK_HERO_STORE.name
      },
      0,
      1
    );
    assert.deepEqual({ name, power }, MOCK_HERO_STORE);
  });

  it("should be update a hero by id", async function() {
    const [item] = await mongodbContext.index(
      {
        name: MOCK_HERO_UPDATE.name
      },
      0,
      1
    );
    const newItem = { ...MOCK_HERO_UPDATE, name: "Goku" };
    await mongodbContext.update(item._id, newItem);
    const [{ name }] = await mongodbContext.index({ _id: item._id }, 0, 1);
    assert.deepEqual(name, newItem.name);
  });

  it("should be delete a hero by id", async function() {
    const [item] = await mongodbContext.index(
      {
        name: MOCK_HERO_STORE.name
      },
      0,
      1
    );
    const result = await mongodbContext.delete({ _id: item._id });
    assert.equal(result, true);
  });
});
