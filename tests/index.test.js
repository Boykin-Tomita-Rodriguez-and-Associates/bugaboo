const request = require("supertest");
const app = require("../server/app");
const { User, Project, Bug } = require("../server/models/index");
const { describe, expect } = require("@jest/globals");
const { seed } = require("../server/seed");

let projectsLength;
let bugsLength;

/* Mocks Auth0 */
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
    password: "july1499",
  };

  const testBugData = {
    error: "You buggin' what? You buggin' who? You buggin' me (bug a boo)",
  };

  let admin;
  let user;

  beforeEach(async () => {
    await seed();
    const projects = await Project.findAll();
    const bugs = await Bug.findAll();
    bugsLength = bugs.length;
    projectsLength = projects.length;
    jest.clearAllMocks();

    admin = await User.findByPk(1);
    user = await User.findByPk(2);
  });

  describe("Get all projects", () => {
    it("successfully retrieves all projects for admin", async () => {
      const allProjects = await Project.findAll({ include: [{ model: Bug }] });
      const response = await request(app)
        .get("/projects")
        .set("Authorization", `Bearer ${admin.email}`);
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
        .set("Authorization", `Bearer ${user.email}`);
      expect(response.statusCode).toBe(200);
      expect(JSON.stringify(response.body)).toBe(JSON.stringify(allProjects));
    });
  });

  describe("Get one project", () => {
    it("successfully retrieves one project for admin or owner", async () => {
      const project = await Project.findByPk(1, { include: Bug });
      const response = await request(app)
        .get("/projects/1")
        .set("Authorization", `Bearer ${admin.email}`);
      expect(response.statusCode).toBe(200);
      expect(JSON.stringify(response.body)).toEqual(JSON.stringify(project));
    });

    it("successfully denies access to a user who doesn't own the project", async () => {
      const response = await request(app)
        .get("/projects/1")
        .set("Authorization", `Bearer ${user.email}`);
      expect(response.statusCode).toBe(403);
    });
  });

  describe("Create a project", () => {
    it("successfully creates a project for admin", async () => {
      const responsePost = await request(app)
        .post("/projects")
        .type("json")
        .set("Authorization", `Bearer ${admin.email}`)
        .send(testProjectData);
      const response = await request(app)
        .get(`/projects/${responsePost.body.id}`)
        .set("Authorization", `Bearer ${admin.email}`);
      expect(responsePost.statusCode).toBe(200);
      expect(response.body.id).toBe(responsePost.body.id);
    });
  });

  describe("Delete a project", () => {
    it("successfully deletes a project for admin or owner", async () => {
      const response = await request(app)
        .delete("/projects/3")
        .set("Authorization", `Bearer ${admin.email}`);
      const projects = await Project.findAll();
      expect(response.statusCode).toEqual(200);
      expect(projects.length).toEqual(projectsLength - 1);
    });

    it("prevents non-owners from deleting a project", async () => {
      const response = await request(app)
        .delete("/projects/1")
        .set("Authorization", `Bearer ${user.email}`);
      expect(response.statusCode).toEqual(403);
    });
  });

  describe("Update a project", () => {
    it("successfully updates a project for admin or owner", async () => {
      const response = await request(app)
        .put("/projects/1")
        .send({ name: "Updated project name" })
        .set("Authorization", `Bearer ${admin.email}`);
      const updatedProject = await Project.findByPk(1);

      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe(updatedProject.name);
    });

    it("successfully prevents a user from updating a project they do not own", async () => {
      const response = await request(app)
        .put("/projects/1")
        .send({ name: "Updated project name" })
        .set("Authorization", `Bearer ${user.email}`);
      expect(response.statusCode).toBe(403);
    });
  });

  describe("Get all bugs for a project", () => {
    it("successfully retrieves a project's bugs", async () => {
      const projectBugs = await Bug.findAll({
        where: {
          projectId: 1,
        },
      });
      const response = await request(app)
        .get("/projects/1/bugs")
        .set("Authorization", `Bearer ${admin.email}`);

      expect(response.statusCode).toBe(200);
      expect(JSON.stringify(response.body)).toBe(JSON.stringify(projectBugs));
    });

    it("prevents non-owners from accessing a project's bugs", async () => {
      const response = await request(app)
        .get("/projects/1/bugs")
        .set("Authorization", `Bearer ${user.email}`);
      expect(response.statusCode).toBe(403);
    });
  });

  describe("Get a single bug", () => {
    it("retrieves the correct bug for admin or project owner", async () => {
      const bug = await Bug.findByPk(1);
      const response = await request(app)
        .get("/projects/1/bugs/1")
        .set("Authorization", `Bearer ${admin.email}`);

      expect(response.statusCode).toBe(200);
      expect(JSON.stringify(response.body)).toBe(JSON.stringify(bug));
    });

    it("prevents non-owners from accessing a project's bug", async () => {
      const response = await request(app)
        .get("/projects/1/bugs/1")
        .set("Authorization", `Bearer ${user.email}`);
      expect(response.statusCode).toBe(403);
    });
  });

  describe("Create a bug", () => {
    it("successfully creates a bug for admin or project owner", async () => {
      const responsePost = await request(app)
        .post("/projects/1/bugs")
        .type("json")
        .set("Authorization", `Bearer ${admin.email}`)
        .send(testBugData);

      const response = await request(app)
        .get(`/projects/1/bugs/${responsePost.body.id}`)
        .set("Authorization", `Bearer ${admin.email}`);

      expect(responsePost.statusCode).toBe(200);
      expect(response.body.id).toBe(responsePost.body.id);
    });

    it("successfully prevents a user from adding bugs to a project they do not own", async () => {
      const response = await request(app)
        .put("/projects/1/bugs")
        .send({
          error:
            "So no I don't want your number, No, I don't wanna give you mine",
        })
        .set("Authorization", `Bearer ${user.email}`);
      expect(response.statusCode).toBe(403);
    });
  });

  describe("Update Bug", () => {
    it("allows a user to update bugs associated with a project they own", async () => {
      const responsePut = await request(app)
        .put("/projects/1/bugs/1")
        .type("json")
        .set("Authorization", `Bearer ${admin.email}`)
        .send({ isFixed: true });

      const response = await request(app)
        .get(`/projects/1/bugs/${responsePut.body.id}`)
        .set("Authorization", `Bearer ${admin.email}`);

      expect(responsePut.statusCode).toBe(200);
      expect(response.body.id).toBe(responsePut.body.id);
    });

    it("prevents non-owners from updating bugs", async () => {
      const responsePut = await request(app)
        .put("/projects/1/bugs/1")
        .type("json")
        .set("Authorization", `Bearer ${user.email}`)
        .send({ isFixed: true });

      expect(responsePut.statusCode).toBe(403);
    });
  });

  describe("Delete Bug", () => {
    it("successfully deletes a bug for admin or project owner", async () => {
      const response = await request(app)
        .delete("/projects/1/bugs/1")
        .set("Authorization", `Bearer ${admin.email}`);
      const bugs = await Bug.findAll();
      expect(response.statusCode).toEqual(200);
      expect(bugs.length).toEqual(bugsLength - 1);
    });

    it("prevents non-owners from deleting a bug", async () => {
      const response = await request(app)
        .delete("/projects/1/bugs/1")
        .set("Authorization", `Bearer ${user.email}`);
      expect(response.statusCode).toEqual(403);
    });
  });

  describe("Get all users", () => {
    it("successfully retrieves all users for admin", async () => {
      const allUsers = await User.findAll({
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
        .set("Authorization", `Bearer ${admin.email}`);
      expect(response.statusCode).toBe(200);
      expect(JSON.stringify(response.body)).toBe(JSON.stringify(allUsers));
    });

    it("prevents a non-admin user from retrieving all users", async () => {
      const response = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${user.email}`);
      expect(response.statusCode).toBe(403);
    });
  });

  describe("Get one user", () => {
    it("prevents a user from retrieving another user", async () => {
      const oneUser = await User.findByPk(3);
      const response = await request(app)
        .get("/users/2")
        .set("Authorization", `Bearer ${oneUser.email}`);
      expect(response.statusCode).toBe(403);
    });

    it("returns one user for admin", async () => {
      const oneUser = await User.findByPk(2);
      const response = await request(app)
        .get("/users/2")
        .set("Authorization", `Bearer ${admin.email}`);
      expect(response.statusCode).toBe(200);
      expect(JSON.stringify(response.body)).toBe(JSON.stringify(oneUser));
    });
  });

  describe("Create users", () => {
    it("successfully creates a user for admin", async () => {
      const newUser = await request(app)
        .post("/users")
        .type("json")
        .set("Authorization", `Bearer ${admin.email}`)
        .send(testUserData);
      const response = await request(app)
        .get(`/users/${newUser.body.id}`)
        .set("Authorization", `Bearer ${admin.email}`);
      expect(newUser.statusCode).toBe(200);
      expect(response.body.id).toBe(newUser.body.id);
    });
  });

  describe("Update a user", () => {
    it("prevents a non-admin user from updating other users", async () => {
      const response = await request(app)
        .put("/users/3")
        .send({ password: "thewritingsonthewall" })
        .set("Authorization", `Bearer ${user.email}`);
      expect(response.statusCode).toBe(403);
    });

    it("successfully updates a user for admin", async () => {
      const response = await request(app)
        .put("/users/3")
        .send({ password: "thewritingsonthewall" })
        .set("Authorization", `Bearer ${admin.email}`);
      const updatedUser = await User.findByPk(3);
      expect(response.statusCode).toBe(200);
      expect(response.body.password).toBe(updatedUser.password);
    });
  });
});
