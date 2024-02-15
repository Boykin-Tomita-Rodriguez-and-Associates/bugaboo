const { Router } = require("express");
const { User, Project, Bug } = require("../models/index");
const express = require("express");
const bugRouter = require("./bug");
const projectRouter = Router();
const { requiresAuth } = require('express-openid-connect');


const adminMiddleWare = async(req, res, next)=>{
  console.log(req.oidc.user.email)
  const user = await User.findAll({
    where: {
      email: req.oidc.user.email
    }
  });
  console.log("user:",user) 
  if(!user[0].isAdmin){
    console.log("Not an admin!")
    res.redirect(`/users/${user[0].id}/projects`)
  }else{

  next()
  }
}

//GET projects (admin)
projectRouter.get("/", requiresAuth(), adminMiddleWare, async (req, res, next) => {
  try {
/////////
    
      console.log(req.oidc.user)
      const projects = await Project.findAll({include: Bug});;
      res.json(projects);
    
/////////

  } catch (error) {
    next(error);
  }
});

//GET one project (user who owns & admin)
projectRouter.get("/:id", requiresAuth(), async (req, res, next) => {
  try {
    const id = req.params.id;
    const project = await Project.findByPk(id, { include: Bug });
    res.json(project);
  } catch (error) {
    next(error);
  }
});

//CREATE a project
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
projectRouter.put("/:id", requiresAuth(), async (req, res, next) => {
    try{
        const id = req.params.id; 
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