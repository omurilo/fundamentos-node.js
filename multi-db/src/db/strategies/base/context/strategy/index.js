const ICrud = require("../../../interfaces/crud");

class ContextStrategy extends ICrud {
  constructor(strategy) {
    super();
    this._database = strategy;
  }

  index(item) {
    return this._database.index(item);
  }

  show(id) {
    return this._database.show(id);
  }

  store(item) {
    return this._database.store(item);
  }

  update(id, item) {
    return this._database.update(id, item);
  }

  delete(query) {
    return this._database.delete(query);
  }

  isConnected() {
    return this._database.isConnected();
  }
}

module.exports = ContextStrategy;
