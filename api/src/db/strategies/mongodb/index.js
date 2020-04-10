const Mongoose = require("mongoose");
const ICrud = require("../interfaces/crud");

class MongoDB extends ICrud {
  constructor(connection, schema) {
    super();
    this._schema = schema;
    this._connection = connection;
  }

  async isConnected() {
    try {
      if (this._connection.readyState === 1) {
        return true;
      } else if (this._connection.readyState === 2) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return this._connection.readyState === 1;
      }

      throw this._connection.readyState;
    } catch (error) {
      console.error(`fail! connection that's on ${error} state`);
      return false;
    }
  }

  static connect() {
    Mongoose.connect(
      "mongodb://murilo:123@localhost:27017/heros",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
      function (error) {
        if (!error) return;
        console.log("Connection failed!", error);
      }
    );

    return Mongoose.connection;
  }

  async index(query, skip = 0, limit = 10) {
    return this._schema
      .find(query, { name: 1, power: 1 })
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async store(item) {
    return this._schema.create(item);
  }

  async update(id, item) {
    const update = await this._schema
      .findOneAndUpdate({ _id: id }, { $set: item }, { returnOriginal: false })
      .lean();
    return update;
  }

  async delete(id) {
    const typeOfDelete = id ? "one" : "many";
    if (typeOfDelete === "one") {
      const deleted = await this._schema.deleteOne({ _id: id });
      return !!deleted.deletedCount;
    } else {
      const deleted = await this._schema.deleteMany({});
      return !!deleted.ok;
    }
  }
}

module.exports = MongoDB;
