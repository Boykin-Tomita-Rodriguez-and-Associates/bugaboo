const { Router } = require("express");
const { User, Project, Bug } = require("../models/index");
const express = require("express");
const userProjectRouter = require("./userProject");
const { requiresAuth } = require('express-openid-connect');

const userRouter = Router();

const adminMiddleWare = async(req, res, next)=>{
  // find the user by their email
  const user = await User.findAll({
    where: {
      email: req.oidc.user.email
    }
  });
  //add if !user check?
  //if user is not admin redirect them to see their project(s) only
  if(!user[0].isAdmin){
    res.redirect(`/users/${user[0].id}/projects`)
  }else{
  next()
  }
}
//GET all users 
//If user is an admin, they can see all, else user is rerouted to their dashboard
userRouter.get("/", requiresAuth(), adminMiddleWare, async (req, res, next) => {
  try {
    const users = await User.findAll({
      //Include projects and associated bugs
      include: [
        {
          model: Project,
          include: [
            {
              model: Bug,
            },
          ],
        },
      ],
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

//GET one user
//same middleware as above
userRouter.get("/:id", requiresAuth(), adminMiddleWare, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        {
          model: Project,
          include: [
            {
              model: Bug,
            },
          ],
        },
      ],
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

//CREATE a user
userRouter.post("/", requiresAuth(), adminMiddleWare, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const newUser = await User.create({ email, password });
    res.json(newUser);
  } catch (error) {
    next(error);
  }
});

//UPDATE a user
//none??
//---> if owner, next
//---> if not owner, throw error
//if admin next

const isOwner = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      email: req.oidc.user.email
    }
  })
  if(user.isAdmin || user.id == req.params.id){
    next()
  } else {
    res.redirect(`/users/${user.id}/projects`)
  }
}


userRouter.put("/:id", requiresAuth(), isOwner, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    await User.update(
      { email, password },
      {
      where: {
        id: req.params.id
      }
    }
      );
    const user = await User.findByPk(req.params.id)
    res.json(user);
  } catch (error) {
    next(error);
  }
});

userRouter.use('/:userId/projects', async (req, res, next) => {
    req.userId = req.params.userId
    next()
}, userProjectRouter)

module.exports = userRouter;