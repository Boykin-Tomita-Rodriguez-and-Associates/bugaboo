const { Sequelize, db } = require("../db");

let User = db.define("user", {
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = User;
