const Sequelize = require("sequelize");

const UserSchema = {
  name: "Users",
  schema: {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  options: {
    tableName: "TB_USERS",
  },
};

module.exports = UserSchema;
