const { deepEqual, ok } = require('assert');
const database = require('./database');

const DEFAULT_ITEM_SAVE = { name: 'Flash', power: 'speed', id: 1 };

describe('Hero Manipulation Suite', () => {

  it('should search a hero using archives', async () => {
    const expected = DEFAULT_ITEM_SAVE;
    const [result] = await database.search(expected.id);
    deepEqual(result, expected);
  })
});