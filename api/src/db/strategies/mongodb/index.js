const Mongoose = require("mongoose");
const { promisify } = require("util");
const ICrud = require("../interfaces/crud");

class MongoDB extends ICrud {
  constructor(connection, schema) {
    super();
    this._schema = schema;
    this._connection = connection;
  }

  async isConnected() {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return this._connection.readyState === 1;
  }

  static async connect() {
    await promisify(Mongoose.connect)(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

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
    const deleted = await this._schema.deleteOne({ _id: id });
    return !!deleted.deletedCount;
  }
}

module.exports = MongoDB;
