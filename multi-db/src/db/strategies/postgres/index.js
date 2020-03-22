const Sequelize = require("sequelize");

const ICrud = require('../interface/crud');

class PosgreSQL extends ICrud {
  constructor() {
    super()
    this._driver = null;
    this._heros = null;
    this._connect();
  }
  show() {}

  store() {}

  index() {}

  update() {}

  delete() {}

  _connect() {
    this._driver = new Sequelize("heros", "murilo", "123", {
      host: "localhost",
      dialect: "postgres",
      quoteIdentifiers: false,
      define: {
        freezeTableName: false,
        timestamps: false
      }
    });
  }
  async isConnected() {
    try {
      await this._driver.authenticate();
      return true;
    } catch (error) {
      console.error('fail!', error);
    }
  }
  defineModel() {
    this._heros = sequelize.define(
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
}

module.exports = PosgreSQL;