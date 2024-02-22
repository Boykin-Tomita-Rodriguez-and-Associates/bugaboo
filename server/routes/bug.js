const bugRouter = require('express').Router(); 
const { Bug } = require("../models/index");

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
        let bugId = req.params.bugId;
        const bug = await Bug.findByPk(bugId)
        res.send(bug)
    }catch(error){
        next(error)
    }
});

bugRouter.post('/', async(req, res, next)=>{
    try{
        console.log("HELLOOOO", res.locals.project.id)
        const projectId = res.locals.project.id;
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
        await Bug.update({error, isFixed}, {where: {id: id}});
        const updatedBug = await Bug.findByPk(id);
        res.json(updatedBug);
    }catch(error){
        next(error);
    };
});

bugRouter.delete('/:bugId', async(req, res, next)=>{
    try{
        const id = req.params.bugId; 
        const bug = await Bug.findByPk(id)
        await bug.destroy({ where: { id: id} });
        res.json({message: `Bug: "${bug.error}" was deleted`});
    }catch(error){
        next(error)
    }
})

module.exports = bugRouter;