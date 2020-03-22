const assert = require('assert');
const Postgres = require('../../db/strategies/postgres');
const Context = require('../../db/strategies/base/context/strategy');

const postgresContext = new Context(new Postgres());

describe('Postgres test', function () {
  this.timeout(Infinity);
  it('should connect to PostgreSQL', async () => {
    const expected = true;
    const result = postgresContext.isConnected();

    return assert.deepEqual(expected, result);
  });
});