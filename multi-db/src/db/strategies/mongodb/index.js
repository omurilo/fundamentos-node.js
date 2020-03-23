const Mongoose = require("mongoose");

const ICrud = require("../interfaces/crud");

class MongoDB extends ICrud {
  constructor() {
    super();
    this._driver = null;
    this._heros = null;
    this._connect();
  }

  async isConnected() {
    try {
      if (Mongoose.connection.readyState === 1) {
        return true;
      } else if (Mongoose.connection.readyState === 2) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return Mongoose.connection.readyState === 1;
      }

      throw Mongoose.connection.readyState;
    } catch (error) {
      console.error(`fail! connection that's on ${error} state`);
      return false;
    }
  }

  _connect() {
    Mongoose.connect(
      "mongodb://murilo:123@localhost:27017/heros",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      function(error) {
        if (!error) return;
        console.log("Connection failed!", error);
      }
    );

    this._defineModel();
  }

  async _defineModel() {
    const heroSchema = new Mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      power: {
        type: String,
        required: true
      },
      birthDate: {
        type: String
      },
      insertedAt: {
        type: Date,
        default: new Date()
      }
    });

    this._heros = Mongoose.model("Hero", heroSchema);
  }

  async index(query, skip = 0, limit = 10) {
    return this._heros
      .find(query, { name: 1, power: 1 })
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async store(item) {
    return this._heros.create(item);
  }

  async update(id, item) {
    const update = await this._heros
      .updateOne({ _id: id }, { $set: item }, {})
      .lean();
    return update;
  }

  async delete(id) {
    const typeOfDelete = id ? "one" : "many";
    if (typeOfDelete === "one") {
      const deleted = await this._heros.deleteOne(id);
      return !!deleted;
    } else {
      const deleted = await this._heros.deleteMany({});
      return !!deleted.ok;
    }
  }
}

module.exports = MongoDB;
