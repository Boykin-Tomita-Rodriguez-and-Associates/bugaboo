const { db } = require("./db");
const { User, Project, Bug } = require("./models/index");
const { users, projects, bugs } = require("./seedData");

const seed = async () => {
  try {
    await db.sync({ force: true });
    await User.bulkCreate(users);
    await Project.bulkCreate(projects);
    await Bug.bulkCreate(bugs);
    console.log("Database seeded successfully");
  } catch (error) {
    console.log(error);
  }
};

seed();

module.exports = { seed };
