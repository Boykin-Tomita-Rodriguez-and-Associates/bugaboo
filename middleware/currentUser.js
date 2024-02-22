const {User} = require('../server/models/index')
const currentUser = async(req, res, next) => {
    try{
        const userOidc = req.oidc.user
        const user = await User.findOrCreate({
        where:
        {
          email: userOidc.email
        }
        });
        res.locals.user = user;
        console.log("current user: ",res.locals.user)
        next();
      }catch(err){
        console.log(err);
        next();
    };
  };

module.exports = {currentUser}

