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
    const id = req.params.projectId
    const user = res.locals.user[0]
    const project = await Project.findByPk(id, { include: Bug });

    /* if(user.isAdmin || project.userId === user.id){ */
      res.json(project);
   /*  }else{
      res.redirect(`/users/${user.id}/projects`)
    } */
  } catch (error) {
    next(error);
  }
});

//CREATE a project (admin)

projectRouter.post("/", requiresAuth(), async (req, res, next) => {
  try {
    const { isComplete, name } = req.body;
    const project = await Project.create({ isComplete, name });
    res.json(project);
  } catch (error) {
    next(error);
  }
});

//UPDATE a project
projectRouter.put("/:id", requiresAuth(), currentUser, async (req, res, next) => {
    try{
        const projectId = req.params.id; 
        const {name, isComplete} = req.body
        await Project.update({name, isComplete}, {where: {id: id}});
       //Get the newly updated project   
       const updatedProject = await Project.findByPk(id, {
            include: {
               model: Bug
            }
        });
        //Send it back
        res.json(updatedProject);
    }catch(error){
        next(error);
    };
});

//DELETE a project (admin)
projectRouter.delete("/:id", requiresAuth(), async (req, res, next) => {
  try {
    const deletedProject = await Project.destroy({ where: { id: req.params.id } });
    const projects = await Project.findAll({});
    if (!deletedProject) {
      throw new Error("Project could not be deleted.");
    }
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

/// Bug Connection 

projectRouter.use('/:projectId/bugs', async(req, res, next)=>{
  req.projectId = req.params.projectId;
  next()
}, bugRouter);

module.exports = projectRouter;