const { Router } = require("express");
const { User, Project, Bug } = require("../models/index");
const express = require("express");
const userProjectRouter = require("./userProject");
const { requiresAuth } = require('express-openid-connect');
const { currentUser } = require('../../middleware/currentUser');
const userRouter = Router();

//GET all users (admin)
userRouter.get("/", requiresAuth(), currentUser, async (req, res, next) => {
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
userRouter.get("/:id", requiresAuth(), async (req, res, next) => {
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
userRouter.post("/", requiresAuth(), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const newUser = await User.create({ email, password });
    res.json(newUser);
  } catch (error) {
    next(error);
  }
});

//UPDATE a user
userRouter.put("/:id", requiresAuth(), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const updatedUser = await User.update({ email, password });
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

userRouter.use('/:userId/projects', async (req, res, next) => {
    req.userId = req.params.userId
    next()
}, userProjectRouter)

module.exports = userRouter;