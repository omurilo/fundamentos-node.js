const Sequelize = require("sequelize");

const ICrud = require("../interfaces/crud");

class PostgreSQL extends ICrud {
  constructor() {
    super();
    this._driver = null;
    this._heros = null;

    this.connect.bind(this)();
  }
  async isConnected() {
    try {
      await this._driver.authenticate();
      return true;
    } catch (error) {
      console.error("fail!", error);
    }
  }
  async defineModel() {
    this._heros = this._driver.define(
      "Heros",
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        power: {
          type: Sequelize.STRING,
          allowNull: false
        }
      },
      {
        tableName: "TB_HEROS"
      }
    );

    await this._heros.sync();
  }
  async show(id) {
    const result = await this._heros.findByPk(id);
    return JSON.parse(JSON.stringify(result));
  }

  async store(item) {
    const { dataValues } = await this._heros.create(item);
    return dataValues;
  }

  async index(query = {}) {
    return this._heros.findAll({ where: query, raw: true });
  }

  update(id, item) {
    return this._heros.update(item, {
      where: { id },
      returning: true,
      raw: true
    });
  }

  delete({ id, areUCrazy }) {
    const query = id ? { id } : areUCrazy && {};
    return this._heros.destroy({ where: query });
  }

  async connect() {
    this._driver = new Sequelize("heros", "murilo", "123", {
      host: "localhost",
      dialect: "postgres",
      quoteIdentifiers: false,
      define: {
        freezeTableName: false,
        timestamps: false
      }
    });

    await this.defineModel();
  }
}

module.exports = PostgreSQL;
