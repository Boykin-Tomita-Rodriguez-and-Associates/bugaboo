const {sequelize} = require('./db');
const {User, Project, Bug} = require('./models/index');
const {users, projects, bugs} = require('./seedData');

const seed = async () => {
  await sequelize.sync({ force: true }); // recreate db
  await User.bulkCreate(users);
  await Project.bulkCreate(projects);
  await Bug.bulkCreate(bugs)
};

module.exports = seed;