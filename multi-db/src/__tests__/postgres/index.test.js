const assert = require("assert");
const Postgres = require("../../db/strategies/postgres");
const Context = require("../../db/strategies/base/context/strategy");

const postgresContext = new Context(new Postgres());

const MOCK_HERO_STORE = { name: "Hawkman ", power: "Arrows" };
const MOCK_HERO_UPDATE = { name: "Batman ", power: "Money" };

describe("Postgres test", function() {
  this.beforeAll(async function() {
    await postgresContext.connect();
    await postgresContext.delete({ areUCrazy: true });
    await postgresContext.store(MOCK_HERO_UPDATE);
  });
  this.timeout(Infinity);
  it("should connect to PostgreSQL", async function() {
    const result = await postgresContext.isConnected();

    assert.equal(result, true);
  });

  it("should be store a hero", async function() {
    const result = await postgresContext.store(MOCK_HERO_STORE);
    delete result.id;
    assert.deepEqual(result, MOCK_HERO_STORE);
  });

  it("should be list a heros", async function() {
    const [results] = await postgresContext.index({
      name: MOCK_HERO_STORE.name
    });
    delete results.id;
    assert.deepEqual(results, MOCK_HERO_STORE);
  });

  it("should be search a hero by id", async function() {
    const [item] = await postgresContext.index({
      name: MOCK_HERO_STORE.name
    });
    const result = await postgresContext.show(item.id);
    delete result.id;
    assert.deepEqual(result, MOCK_HERO_STORE);
  });

  it("should be update a hero by id", async function() {
    const [item] = await postgresContext.index({
      name: MOCK_HERO_UPDATE.name
    });
    const newItem = { ...MOCK_HERO_UPDATE, name: "Goku" };
    const [, [result]] = await postgresContext.update(item.id, newItem);
    delete result.id;
    assert.deepEqual(result.name, newItem.name);
  });

  it("should be delete a hero by id", async function() {
    const [item] = await postgresContext.index({
      name: MOCK_HERO_STORE.name
    });
    const result = await postgresContext.delete({ id: item.id });
    assert.equal(result, true);
  });
});
