const assert = require("assert");
const MongoDB = require("../../db/strategies/mongodb");
const Context = require("../../db/strategies/base/context/strategy");

const mongodbContext = new Context(new MongoDB());

const MOCK_HERO_STORE = { name: "Hawkman ", power: "Arrows" };
const MOCK_HERO_UPDATE = { name: "Batman ", power: "Money" };

describe("MongoDB test", function() {
  this.timeout(Infinity);
  it("should connect to MongoDB", async function() {
    const result = await mongodbContext.isConnected();

    assert.equal(result, true);
  });
});
