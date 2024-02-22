const {User} = require('../server/models/index')
const adminProtected = async(req, res, next)=>{
  const user = res.locals.user[0]
    //add if !user check?
    //if user is not admin redirect them to see their project(s) only
    if(!user.isAdmin){
      res.redirect(`/users/${user.id}/projects`)
    }else{
    next()
    }
  }

  module.exports = { adminProtected }