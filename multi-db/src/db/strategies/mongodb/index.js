const mongoose = require("mongoose");

const ICrud = require("../interfaces/crud");

class MongoDB extends ICrud {
  constructor() {
    super();
    this._driver = null;
    this._heros = null;
    this.connect();
  }
  async isConnected() {
    try {
      if (mongoose.connection.readyState === 1) {
        return true;
      }

      throw mongoose.connection.readyState;
    } catch (error) {
      console.error(`fail! connection that's on ${error} state`);
    }
  }
  connect() {
    this._driver = mongoose.connect(
      "mongodb://murilo:123@localhost:27017/heros",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );
    this.defineModel();
  }
  defineModel() {
    const schema = new mongoose.Schema({
      name: "string",
      power: "string",
      birthDate: "string"
    });
    this._heros = mongoose.model("Hero", schema);
  }

  async store(item) {
    const store = (await this._heros.create(item)).toObject();
    delete store._id;
    delete store.__v;
    return store;
  }
}

module.exports = MongoDB;
