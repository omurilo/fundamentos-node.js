const assert = require("assert");
const MongoDB = require("../../db/strategies/mongodb");
const Context = require("../../db/strategies/base/context/strategy");

const mongodbContext = new Context(new MongoDB());

const MOCK_HERO_STORE = { name: "Hawkman ", power: "Arrows" };
const MOCK_HERO_UPDATE = { name: "Batman ", power: "Money" };

describe("MongoDB test", function() {
  this.beforeAll(async function() {
    await mongodbContext.store(MOCK_HERO_UPDATE);
  });

  this.timeout(Infinity);
  it("should connect to MongoDB", async function() {
    const result = await mongodbContext.isConnected();

    assert.equal(result, true);
  });

  it("should be store a hero", async function() {
    const result = await mongodbContext.store(MOCK_HERO_STORE);
    assert.deepEqual(result, MOCK_HERO_STORE);
  });

  it("should be list a heros", async function() {
    const [results] = await mongodbContext.index({
      name: MOCK_HERO_STORE.name
    });
    delete results._id;
    assert.deepEqual(results, MOCK_HERO_STORE);
  });

});
