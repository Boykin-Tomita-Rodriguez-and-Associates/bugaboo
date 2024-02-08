const { Router } = require("express");
const { User, Project, Bug } = require("../models/index");
const express = require("express");

const projectRouter = Router();

//GET projects (users & admin)
projectRouter.get("/", async (req, res, next) => {
  try {
    const projects = await Project.findAll({ include: Bug });
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

//GET one project (user who owns & admin)
projectRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const project = await Project.findByPk(id, { include: Bug });
    res.json(project);
  } catch (error) {
    next(error);
  }
});

//CREATE a project (admin)
projectRouter.post("/", async (req, res, next) => {
  try {
    const { isComplete, name } = req.body;
    const project = await Project.create({ isComplete, name });
    res.json(project);
  } catch (error) {
    next(error);
  }
});

//UPDATE a project - add a bug & update status (user & admin)
projectRouter.put("/:id", async (req, res, next) => {
    try{
        console.log(req.body.bug)
        const id = req.params.id; 
        //MOVE TO NESTED BUG ROUTE
          //First, check is a bug was included, if so create it and assign to the exisiting project.
          //if(req.body.bug){
          //    const error = req.body.bug.error
          //    console.log("we have a bug!")
          //    const newBug = await Bug.create({error: error, projectId: id})
          //    console.log(newBug)
          //};
          //Then check to see if any other part of the project should be updated
        
        const {name, isComplete} = req.body
        const response = await Project.update({name, isComplete}, {where: {id: id}});
      
        console.log(id)
       //Get the newly updated project   
       const updatedProject = await Project.findAll({
            where: {
                id: id
            }, 
            include: {
               model: Bug
            }
        });
        //Send it back
        console.log(updatedProject);
        res.json(updatedProject);
    }catch(error){
        next(error);
    };
});

//DELETE a project (admin)
projectRouter.delete("/:id", async (req, res, next) => {
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

module.exports = projectRouter;