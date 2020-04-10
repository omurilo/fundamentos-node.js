const Sequelize = require('sequelize');

const HeroSchema = {
  name: 'Heroes',
  schema: {
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
  options: {
    tableName: "TB_HEROS"
  }
}

module.exports = HeroSchema;