const ICrud = require("../../../interfaces/crud");

class ContextStrategy extends ICrud {
  constructor(strategy) {
    super();
    this._database = strategy;
  }

  index(query, skip, limit) {
    return this._database.index(query, skip, limit);
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

  static connect() {
    return this._database.connect();
  }
}

module.exports = ContextStrategy;
