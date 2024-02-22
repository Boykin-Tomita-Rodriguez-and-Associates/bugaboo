const {User, Project, Bug} = require('../server/models/index')
const ownerOrAdmin = async (req, res, next) => {
  console.log(req.params)
  const user = res.locals.user[0]
  if(req.params.projectId){
    const id = req.params.projectId
    const project = await Project.findByPk(id, { include: Bug });
    if(user.isAdmin || project.userId === user.id){
      res.locals.project = project
      next()
    }else{
      res.redirect(`/projects`)
    }
  /////////////////  
  }else if(req.params.userId){
    console.log("USERID!", user.id === parseInt(req.params.userId))
    if(user.isAdmin || user.id === parseInt(req.params.userId)){
      next()
    } else {
      res.redirect(`/projects`)
    }
  }
  }

  module.exports = { ownerOrAdmin }