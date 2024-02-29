/* Checks which router is being used then displays data based off of owner or admin status */
const { Project, Bug } = require("../server/models/index");
const ownerOrAdmin = async (req, res, next) => {
  const user = res.locals.user[0];
  if (req.params.projectId) {
    const id = req.params.projectId;
    const project = await Project.findByPk(id, { include: Bug });
    if (user.isAdmin || project.userId === user.id) {
      res.locals.project = project;
      next();
    } else {
      res.status(403).json({ error: "Access denied" });
    }
  } else if (req.params.userId) {
    if (user.isAdmin || user.id === parseInt(req.params.userId)) {
      next();
    } else {
      res.status(403).json({ error: "Access denied" });
    }
  }
};

module.exports = { ownerOrAdmin };
