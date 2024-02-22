const { Router } = require("express");
const { User, Project, Bug } = require("../models/index");
const express = require("express");
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
    const user = res.locals.user[0]
    if(user.isAdmin){
      const foundUser = await User.findByPk(req.params.userId)
      res.json(foundUser)
    } else {
      res.json(user);
    }
  } catch (error) {
    next(error);
  }
});

//CREATE a user
userRouter.post("/", requiresAuth(), currentUser, adminProtected, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const newUser = await User.create({ email, password });
    res.json(newUser);
  } catch (error) {
    next(error);
  }
});

//UPDATE a user
userRouter.put("/:userId", requiresAuth(), currentUser, ownerOrAdmin, async (req, res, next) => {
  try {
    const user = res.locals.user[0]
    const { email, password } = req.body; 
    if(user.isAdmin){
    await User.update(
        { email, password },
        {where: {id: req.params.userId}})
        const updatedUser = await User.findByPk(req.params.userId)
      res.json(updatedUser)
      } else {
        const updatedUser = await user.update({ email, password })
        res.json(updatedUser)
      }
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;