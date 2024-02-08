const bugRouter = require('express').Router(); 
const { User, Project, Bug } = require("../models/index");


bugRouter.get('/', async(req, res, next) => {
    try{
        let projectId = req.projectId; 
        const project = await Project.findByPk(projectId, {
            include: {
                model: Bug
            }
        });
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

module.exports = bugRouter;