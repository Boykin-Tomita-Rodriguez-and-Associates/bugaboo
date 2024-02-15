const { Router } = require("express");
const { User, Project, Bug } = require("../models/index");
const express = require("express");
const userProjectRouter = Router();

//GET a users projects + bugs
userProjectRouter.get("/", async (req, res, next) => {
  try {
    let userId = req.userId;
    //Find all projects + bugs associated with a user's Id
    const projects = await Project.findAll({
      where: {
        userId: userId,
      },
      include: Bug,
    });
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

//UPDATE a project's name + status
userProjectRouter.put("/:projectId", async (req, res, next) => {
  try {
    const { isComplete, name } = req.body;
    const updatedProject = await Project.update({name, isComplete}, {where: {id: req.params.projectId}});
    //Find the project after the update
    const project = await Project.findByPk(req.params.projectId)
    res.json(project);
  } catch (error) {
    next(error);
  }
});

//ADD a project
userProjectRouter.post("/", async (req, res, next) => {
  try {
    let userId = req.userId;
    const { name } = req.body;
    const project = await Project.create({ name, userId });
    res.json(project);
  } catch (error) {
    next(error);
  }
});

//DELETE a project
userProjectRouter.delete("/:projectId", async (req, res, next) => {
  try {
    const deletedProject = await Project.destroy({
      where: { id: req.params.projectId },
    });
    const projects = await Project.findAll({});
    if (!deletedProject) {
      throw new Error("Project could not be deleted.");
    }
    res.json({ message: "Your project has been successfully deleted." });
  } catch (error) {
    next(error);
  }
});

//GET all bugs

//GET one bug

//CREATE a bug

//UPDATE a bug

//DELETE a bug

module.exports = userProjectRouter;
