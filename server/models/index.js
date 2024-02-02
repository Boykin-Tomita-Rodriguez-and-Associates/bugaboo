const User = require('./User');
const Project = require('./Project');
const Bug = require('./Bug');

User.hasMany(Project);
Project.belongsTo(User);

Project.hasMany(Bugs);
Bug.belongsTo(Project);

module.exports = { 
    User,
    Project, 
    Bug
}