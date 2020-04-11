const Sequelize = require("sequelize");

const ICrud = require("../interfaces/crud");

class PostgreSQL extends ICrud {
  constructor(connection, model) {
    super();
    this._connection = connection;
    this._schema = model;
  }
  async isConnected() {
    try {
      await this._connection.authenticate();
      return true;
    } catch (error) {
      console.error("fail!", error);
    }
  }

  static async defineModel(connection, schema) {
    const model = connection.define(schema.name, schema.schema, schema.options);
    await model.sync();
    return model;
  }

  async show(id) {
    const result = await this._schema.findByPk(id);
    return JSON.parse(JSON.stringify(result));
  }

  async store(item) {
    const { dataValues } = await this._schema.create(item);
    return dataValues;
  }

  async index(query = {}) {
    return this._schema.findAll({ where: query, raw: true });
  }

  update(id, item, upsert = false) {
    const fn = upsert ? "upsert" : "update";
    return this._schema[fn](item, {
      where: { id },
      returning: true,
      raw: true,
    });
  }

  delete({ id, areUCrazy }) {
    const query = id ? { id } : areUCrazy && {};
    return this._schema.destroy({ where: query });
  }

  static connect() {
    const connection = new Sequelize(process.env.DB_URL, {
      dialect: process.env.DB_DIALECT,
      quoteIdentifiers: false,
      logging: false,
      ssl: Boolean(JSON.parse(process.env.SSL_DB)),
      dialectOptions: {
        ssl: Boolean(JSON.parse(process.env.SSL_DB)),
      },
      define: {
        freezeTableName: false,
        timestamps: false,
      },
    });
    return connection;
  }
}

module.exports = PostgreSQL;
