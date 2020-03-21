const assert = require('assert');
const { getPeoples } = require('./service');

describe('Star Wars Tests', function () {
  it('should search r2-d2 with correct format', async () => {
    const expected = [{ name: 'R2-D2', height: '96'}];
    const baseName = 'r2-d2'
    const result = await getPeoples(baseName);

    assert.deepEqual(result, expected);
  });
})