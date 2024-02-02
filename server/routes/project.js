const { Router } = require('express');
const { User, Project, Bug } = require('../models/index');
const express = require('express'); 

const projectRouter = Router();

//GET projects (users & admin)
projectRouter.get('/', async (req, res, next) => {
    try {
        const projects = await Project.findAll({include: Bug});
        res.json(projects);
    }  catch (error) {
        next(error);
    }
})

//GET one project (user who owns & admin)
projectRouter.get('/:id', async (req, res, next) => {
    try{
        const id = req.params.id;
        const project = await Project.findByPk(id, {include: Bug});
        res.json(project);
    } catch (error) {
        next(error);
    }
})

//CREATE a project (admin)


//UPDATE a project - add a bug & update status (user & admin)

//DELETE a project (admin)

module.exports = projectRouter;