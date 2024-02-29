const { Router } = require("express");
const { Project, Bug } = require("../models/index");
const bugRouter = require("./bug");
const projectRouter = Router();
const { requiresAuth } = require("express-openid-connect");
const { currentUser } = require("../../middleware/currentUser");
const { ownerOrAdmin } = require("../../middleware/ownerOrAdmin");

/* Returns all projects for admin or returns a non-admin user's associated projects */
projectRouter.get("/", requiresAuth(), currentUser, async (req, res, next) => {
  try {
    const user = res.locals.user[0];
    let projects;

    if (user.isAdmin) {
      projects = await Project.findAll({ include: Bug });
    } else {
      projects = await Project.findAll({
        where: {
          userId: user.id,
        },
        include: Bug,
      });
    }
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

/* Returns one project for admin and owner of project */
projectRouter.get(
  "/:projectId",
  requiresAuth(),
  currentUser,
  ownerOrAdmin,
  async (req, res, next) => {
    try {
      const project = res.locals.project;
      res.json(project);
    } catch (error) {
      next(error);
    }
  }
);

/* Creates a project and associates the project with the current user */
projectRouter.post("/", requiresAuth(), currentUser, async (req, res, next) => {
  try {
    const user = res.locals.user[0];
    const { isComplete, name } = req.body;
    const project = await Project.create({ isComplete, name, userId: user.id });
    res.json(project);
  } catch (error) {
    next(error);
  }
});

/* Allows admin to update any project or allows a non-admin user to update their own projects */
projectRouter.put(
  "/:projectId",
  requiresAuth(),
  currentUser,
  ownerOrAdmin,
  async (req, res, next) => {
    try {
      const id = req.params.projectId;
      const project = res.locals.project;
      const { name, isComplete } = req.body;
      const updatedProject = await project.update({ name, isComplete });
      res.json(updatedProject);
    } catch (error) {
      next(error);
    }
  }
);

/* Deletes a project for admin and owner of project */
projectRouter.delete(
  "/:projectId",
  requiresAuth(),
  currentUser,
  ownerOrAdmin,
  async (req, res, next) => {
    try {
      const project = res.locals.project;
      const deletedProject = await project.destroy();

      if (!deletedProject) {
        throw new Error("Project could not be deleted.");
      }
      res.json({ message: `${project.name} was deleted!` });
    } catch (error) {
      next(error);
    }
  }
);

/* Connects project router to bug router */
projectRouter.use(
  "/:projectId/bugs",
  requiresAuth(),
  currentUser,
  ownerOrAdmin,
  async (req, res, next) => {
    req.projectId = req.params.projectId;
    next();
  },
  bugRouter
);

module.exports = projectRouter;
