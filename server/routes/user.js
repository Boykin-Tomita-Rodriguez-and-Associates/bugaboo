const { Router } = require("express");
const { User, Project, Bug } = require("../models/index");
const { requiresAuth } = require("express-openid-connect");
const { currentUser } = require("../../middleware/currentUser");
const { adminProtected } = require("../../middleware/adminProtected");
const { ownerOrAdmin } = require("../../middleware/ownerOrAdmin");
const userRouter = Router();

/* Returns all users for admin or redirects a non-admin user to their project dashboard */
userRouter.get(
  "/",
  requiresAuth(),
  currentUser,
  adminProtected,
  async (req, res, next) => {
    try {
      const users = await User.findAll({
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
  }
);

/* Returns one user for admin or displays a non-admin user's account information */
userRouter.get(
  "/:userId",
  requiresAuth(),
  currentUser,
  ownerOrAdmin,
  async (req, res, next) => {
    try {
      const user = res.locals.user[0];
      if (user.isAdmin) {
        const foundUser = await User.findByPk(req.params.userId);
        res.json(foundUser);
      } else {
        res.json(user);
      }
    } catch (error) {
      next(error);
    }
  }
);

/* Creates one user for admin */
userRouter.post(
  "/",
  requiresAuth(),
  currentUser,
  adminProtected,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const newUser = await User.create({ email, password });
      res.json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

/* Allows admin to update any user or allows a non-admin user to update their own account */
userRouter.put(
  "/:userId",
  requiresAuth(),
  currentUser,
  ownerOrAdmin,
  async (req, res, next) => {
    try {
      const user = res.locals.user[0];
      const { email, password } = req.body;
      if (user.isAdmin) {
        await User.update(
          { email, password },
          { where: { id: req.params.userId } }
        );
        const updatedUser = await User.findByPk(req.params.userId);
        res.json(updatedUser);
      } else {
        const updatedUser = await user.update({ email, password });
        res.json(updatedUser);
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = userRouter;
