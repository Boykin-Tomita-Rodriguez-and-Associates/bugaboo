const {User} = require('../server/models/index')
const ownerOrAdmin = async (req, res, next) => {
  const user = res.locals.user[0]
    if(user.isAdmin || user.id == req.params.id){
      next()
    } else {
      res.redirect(`/users/${user.id}/projects`)
    }
  }

  module.exports = { ownerOrAdmin }