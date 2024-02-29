const { Sequelize, db } = require("../db");

let Project = db.define("project", {
  isComplete: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  name: Sequelize.STRING,
});

module.exports = Project;
