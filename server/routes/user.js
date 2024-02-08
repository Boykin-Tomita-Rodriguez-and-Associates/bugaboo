const { Router } = require("express");
const { User, Project, Bug } = require("../models/index");
const express = require("express");

const userRouter = Router();

//GET all users (admin)
userRouter.get("/", async (req, res, next) => {
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
userRouter.get("/:id", async (req, res, next) => {
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
userRouter.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const newUser = await User.create({ email, password });
    res.json(newUser);
  } catch (error) {
    next(error);
  }
});

//UPDATE a user
userRouter.put("/:id", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const updatedUser = await User.update({ email, password });
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

// userRouter.put("/:id/projects/:projectId", async (req, res, next) => {
//     try {
//         //Find user and project
//         const user = await User.findByPk(req.params.id)
//         const project = await Project.findByPk(req.params.projectId)
//         //Associate user and project
//         await user.addProject(project)
//         //Return the user with all associated project
//         const updatedUser = await User.findByPk(req.params.id, {
//             include: [
//               {
//                 model: Project,
//                 include: [
//                   {
//                     model: Bug,
//                   },
//                 ],
//               },
//             ],
//           });
//           res.json(updatedUser);
//         } catch (error) {
//           next(error);
//         }
//     })

module.exports = userRouter;
