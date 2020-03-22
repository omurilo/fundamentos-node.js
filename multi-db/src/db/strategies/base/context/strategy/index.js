const ICrud = require("../../../interface/crud");

class ContextStrategy extends ICrud {
  constructor(strategy) {
    super();
    this._database = strategy;
  }
  index() {
    return this._database.index();
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

  delete(id) {
    return this._database.delete(id);
  }
}

module.exports = ContextStrategy;
