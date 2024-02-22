const { Router } = require("express");
const { User, Project, Bug } = require("../models/index");
const express = require("express");
const userProjectRouter = require("./userProject");
const { requiresAuth } = require('express-openid-connect');
const { currentUser } = require('../../middleware/currentUser');
const { adminProtected } = require("../../middleware/adminProtected");
const { ownerOrAdmin } = require("../../middleware/ownerOrAdmin");
const userRouter = Router();

//GET all users 
//If user is an admin, they can see all, else user is rerouted to their dashboard
userRouter.get("/", requiresAuth(), currentUser, adminProtected, async (req, res, next) => {
  try {
    console.log("I'm the users router, current_user: ", res.locals.user);
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
userRouter.get("/:userId", requiresAuth(), currentUser, ownerOrAdmin, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id/* , {
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
    } */);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

//CREATE a user
userRouter.post("/", requiresAuth(), adminProtected, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const newUser = await User.create({ email, password });
    res.json(newUser);
  } catch (error) {
    next(error);
  }
});

//UPDATE a user

userRouter.put("/:id", requiresAuth(), ownerOrAdmin, async (req, res, next) => {
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