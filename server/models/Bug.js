const { Sequelize, db } = require("../db");

let Bug = db.define("bug", {
  isFixed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  error: Sequelize.STRING,
});

module.exports = Bug;
