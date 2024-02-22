const bugRouter = require('express').Router(); 
const { User, Project, Bug } = require("../models/index");
const { requiresAuth } = require('express-openid-connect');
const { currentUser } = require('../../middleware/currentUser');
const { adminProtected } = require("../../middleware/adminProtected");
const { ownerOrAdmin } = require("../../middleware/ownerOrAdmin");

//GET all the bugs for a project
bugRouter.get('/', async(req, res, next) => {
    try{
        const project = res.locals.project
        const bugs = project.bugs; 
        console.log(bugs)
        res.json(bugs)
    }catch(error){
        next(error)
    }
})

bugRouter.get('/:bugId', async(req, res, next) => {
    try{
        let projectId = req.projectId; 
        let bugId = req.params.bugId;
        const bug = await Bug.findByPk(bugId)
        res.send(bug)
    }catch(error){
        next(error)
    }
});

bugRouter.post('/', async(req, res, next)=>{
    try{
        const projectId = req.projectId;
        const {error, isFixed} = req.body;

        const newBug = await Bug.create({error, isFixed, projectId});
        res.json(newBug);
    }catch(error){
        next(error);
    };
});

bugRouter.put('/:bugId', async(req, res, next)=>{
    try{
        const id = req.params.bugId
        const {error, isFixed} = req.body;
        const updatedBug = await Bug.update({error, isFixed}, {where: {id: req.params.bugId}});
        res.json(updatedBug);
    }catch(error){
        next(error);
    };
});

bugRouter.delete('/:bugId', async(req, res, next)=>{
    try{
        const id = req.params.bugId; 
        await Bug.destroy({ where: { id: req.params.bugId } });
        res.json({message: "Bug deleted"});
    }catch(error){
        next(error)
    }
})

module.exports = bugRouter;