const request = require("supertest");
const app = require("../server/app");
const { User, Project, Bug } = require("../server/models/index");
const { describe, test, expect } = require("@jest/globals");
const { db } = require("../server/db");
const { seed } = require("../server/seed");
const { projects, users, bugs } = require("../server/seedData");
const projectRouter = require("../server/routes/project");
let projectsLength;
let usersLength;

//Mock Auth0
jest.mock("express-openid-connect", () => ({
  auth: jest.fn(() => {
    return (req, res, next) => {
      next();
    };
  }),
  requiresAuth: jest.fn(() => {
    return (req, res, next) => {
      const email = req.headers.authorization.split(" ")[1];
      req.oidc = { user: { email } };
      next();
    };
  }),
}));

describe("Project testing", () => {
  const testProjectData = {
    isCompleted: false,
    name: "Project Bugaboo",
  };

  const testUserData = {
    email: "destinyschild@gmail.com",
    password: "july1499"
  }

  let admin;
  let user;
  

  beforeEach(async () => {
    await seed();
    const projects = await Project.findAll();
    const users = await User.findAll();
    projectsLength = projects.length;
    usersLength = users.length
    jest.clearAllMocks()

    admin = await User.findByPk(1)
    user = await User.findByPk(2)
    
  });


  describe("Get all projects", () => {
    it("Successfully retrieves all projects", async () => {
      const allProjects = await Project.findAll({ include: [{ model: Bug }] });
      const response = await request(app)
      .get("/projects")
      .set("Authorization", `Bearer ${admin.email}`)
      expect(response.statusCode).toBe(200);
      expect(JSON.stringify(response.body)).toBe(JSON.stringify(allProjects));
    });

    it("successfully shows a user only their projects", async () => {
      const allProjects = await Project.findAll({
        where: {
          userId: user.id,
        },
        include: Bug,
      });
      const response = await request(app)
      .get("/projects")
      .set("Authorization", `Bearer ${user.email}`)
      expect(response.statusCode).toBe(200);
      expect(JSON.stringify(response.body)).toBe(JSON.stringify(allProjects));
    });
  });

  describe("Get one project", () => {
    it("successfully retrieves one project", async () => {
      const project = await Project.findByPk(1, { include: Bug });
      const response = await request(app)
      .get("/projects/1")
      .set("Authorization", `Bearer ${admin.email}`)
      expect(response.statusCode).toBe(200);
      expect(JSON.stringify(response.body)).toEqual(JSON.stringify(project));
    });

    it("successfully deny access to a user who doesn't own a project" , async () => {
      const response = await request(app)
      .get("/projects/1")
      .set("Authorization", `Bearer ${user.email}`)
      expect(response.statusCode).toBe(403);
    })
  });

  describe("Create a project", () => {
    it("Successfully creates a project", async () => {
      const responsePost = await request(app)
        .post("/projects")
        .type("json")
        .set("Authorization", `Bearer ${admin.email}`)
        .send(testProjectData);
      const response = await request(app)
        .get(`/projects/${responsePost.body.id}`)
        .set("Authorization", `Bearer ${admin.email}`)
      expect(responsePost.statusCode).toBe(200);
      expect(response.body.id).toBe(responsePost.body.id);
    });
  });

  describe("Delete a project", () => {
    it("Successfully deletes a project", async () => {
      const response = await request(app)
        .delete("/projects/3")
        .set("Authorization", `Bearer ${admin.email}`)
      const projects = await Project.findAll();
      expect(response.statusCode).toEqual(200);
      expect(projects.length).toEqual(projectsLength - 1);
    });

    it("Prevents non-owners from deleting a project", async () => {
      const response = await request(app)
        .delete("/projects/1")
        .set("Authorization", `Bearer ${user.email}`)
      expect(response.statusCode).toEqual(403);
    })
  });

  describe("Update a project", () => {
    it("Successfully updates a project", async () => {
        const response = await request(app)
        .put("/projects/1")
        .send({name: "Updated project name"})
        .set("Authorization", `Bearer ${admin.email}`)
        const updatedProject = await Project.findByPk(1);
 
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(updatedProject.name)
    });

    it("Successfully prevents a user from updating a project that isn't theirs", async () => {
      const response = await request(app)
        .put("/projects/1")
        .send({name: "Updated project name"})
        .set("Authorization", `Bearer ${user.email}`)
        expect(response.statusCode).toBe(403);
    })
  });
  //Bug Routes
  describe("Get all bugs for a project", () => {
    it("successfully retrieves a project's bugs", async () => {
      const projectBugs = await Bug.findAll({
          where: {
              projectId: 1
          }
      });
      const response = await request(app)
        .get("/projects/1/bugs")
        .set("Authorization", `Bearer ${admin.email}`)

      expect(response.statusCode).toBe(200);
      expect(JSON.stringify(response.body)).toBe(JSON.stringify(projectBugs));
    });
  });

  describe("Get a single bug", ()=>{
      it("retrieves the correct bug", async()=>{
          const bug = await Bug.findByPk(1); 
          const response = await request(app)
            .get("/projects/1/bugs/1")
            .set("Authorization", `Bearer ${admin.email}`)

          expect(response.statusCode).toBe(200);
          expect(JSON.stringify(response.body)).toBe(JSON.stringify(bug))
      });
  });

  //User tests
  describe("Get all users", () => {
    it("Successfully retrieves all users", async ()=> {
      const allUsers = await User.findAll({
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
      const response = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${admin.email}`)
      expect(response.statusCode).toBe(200);
      expect(JSON.stringify(response.body)).toBe(JSON.stringify(allUsers));
    });

    it("Prevents a non-admin user from retrieving all users", async ()=> {
      const allUsers = await User.findAll({
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
      const response = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${user.email}`)
      expect(response.statusCode).toBe(403);
    })
  })

  describe("Get one project", ()=> {
     it("Does not return another user if requester is not admin", async ()=> {
    const oneUser = await User.findByPk(3)
    const response = await request(app)
      .get("/users/2")
      .set("Authorization", `Bearer ${oneUser.email}`)
    expect(response.statusCode).toBe(403)
  })

  it("Returns one user for admin", async () => {
    const oneUser = await User.findByPk(2)
    const response = await request(app)
      .get("/users/2")
      .set("Authorization", `Bearer ${admin.email}`)
    expect(response.statusCode).toBe(200)
    expect(JSON.stringify(response.body)).toBe(JSON.stringify(oneUser))
  })
  })
 
  describe("Create users", ()=> {
    it("Successfully creates a user", async ()=> {
    const newUser = await request(app)
    .post("/users")
    .type("json")
    .set("Authorization", `Bearer ${admin.email}`)
    .send(testUserData);
  const response = await request(app)
    .get(`/users/${newUser.body.id}`)
    .set("Authorization", `Bearer ${admin.email}`)
  expect(newUser.statusCode).toBe(200);
  expect(response.body.id).toBe(newUser.body.id);
  })
  })
  
  describe("Update a user", ()=> {
    it("Prevents a non-admin user from updating other users", async ()=> {
      const response = await request(app)
        .put("/users/3")
        .send({password: "thewritingsonthewall"})
        .set("Authorization", `Bearer ${user.email}`)
      const updatedUser = await User.findByPk(3)
      expect(response.statusCode).toBe(403)
    })

    it("Allows admin to update a user", async ()=> {
      const response = await request(app)
        .put("/users/3")
        .send({password: "thewritingsonthewall"})
        .set("Authorization", `Bearer ${admin.email}`)
      const updatedUser = await User.findByPk(3)
      expect(response.statusCode).toBe(200)
      expect(response.body.password).toBe(updatedUser.password)
    })
  })
});
