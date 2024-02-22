const { Router } = require("express");
const { User, Project, Bug } = require("../models/index");
const express = require("express");
const bugRouter = require("./bug");
const projectRouter = Router();
const { requiresAuth } = require('express-openid-connect');
const { currentUser } = require('../../middleware/currentUser');
const { ownerOrAdmin } = require("../../middleware/ownerOrAdmin");



//GET projects (admin gets to see all projects, a user sees their projects/dashboard)
//requires auth, gets current user, protects route for owner or admin, shows appropriate projects
projectRouter.get("/", requiresAuth(), currentUser, async (req, res, next) => {
  try {
      const user = res.locals.user[0]
      let projects; 

      if(user.isAdmin){
        projects = await Project.findAll({include: Bug});;
        
      }else{
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

//GET one project (user who owns & admin)
projectRouter.get("/:projectId", requiresAuth(), currentUser, ownerOrAdmin, async (req, res, next) => {
  try {
    const project = res.locals.project
      res.json(project);
  } catch (error) {
    next(error);
  }
});

//CREATE
projectRouter.post("/", requiresAuth(), currentUser, async (req, res, next) => {
  try {
    const user = res.locals.user[0]
    const { isComplete, name } = req.body;
    const project = await Project.create({ isComplete, name, userId: user.id });
    res.json(project);
  } catch (error) {
    next(error);
  }
});

//UPDATE a project
projectRouter.put("/:projectId", requiresAuth(), currentUser, ownerOrAdmin, async (req, res, next) => {
    try{
        const id = req.params.projectId; 
        const project = res.locals.project
        const {name, isComplete} = req.body
        const updatedProject = await project.update({name, isComplete});
        console.log(updatedProject)
        //Send it back
        res.json(updatedProject);
    }catch(error){
        next(error);
    };
});

//DELETE a project (admin)
projectRouter.delete("/:projectId", requiresAuth(), currentUser, ownerOrAdmin, async (req, res, next) => {
  try {
    const project = res.locals.project;
    const deletedProject = await project.destroy();
    
    if (!deletedProject) {
      throw new Error("Project could not be deleted.");
    }
    res.json({message: `${project.name} was deleted!`});
  } catch (error) {
    next(error);
  }
});

/// Bug Connection 

projectRouter.use('/:projectId/bugs', requiresAuth(), currentUser, ownerOrAdmin, async(req, res, next)=>{
  req.projectId = req.params.projectId;
  next()
}, bugRouter);

module.exports = projectRouter;