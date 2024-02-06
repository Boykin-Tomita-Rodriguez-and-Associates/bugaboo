const request = require("supertest");
const app = require("../server/app");
const { User, Project, Bug } = require("../server/models/index");
const { describe, test, expect } = require("@jest/globals");
const { db } = require("../server/db");
const { seed } = require("../server/seed");
const { projects, users, bugs } = require("../server/seedData");
const projectRouter = require("../server/routes/project");
let projectsLength;

describe("Project testing", () => {
  const testProjectData = {
    isCompleted: false,
    name: "Project Bugaboo",
  };

  beforeEach(async () => {
    await seed();
    const projects = await Project.findAll();
    projectsLength = projects.length;
  });

  describe("Get all projects", () => {
    it("successfully retrieves all projects", async () => {
      const allProjects = await Project.findAll({ include: [{ model: Bug }] });
      const response = await request(app).get("/projects");

      expect(response.statusCode).toBe(200);
      expect(JSON.stringify(response.body)).toBe(JSON.stringify(allProjects));
    });
  });

  describe("Get one project", () => {
    it("successfully retrieves one project", async () => {
      const project = await Project.findByPk(1, { include: Bug });
      const response = await request(app).get("/projects/1");

      expect(response.statusCode).toBe(200);
      expect(JSON.stringify(response.body)).toEqual(JSON.stringify(project));
    });
  });

  describe("Create a project", () => {
    it("Successfully creates a project", async () => {
      const responsePost = await request(app)
        .post("/projects")
        .send(testProjectData);
      const response = await request(app).get(
        `/projects/${responsePost.body.id}`
      );
      expect(responsePost.statusCode).toBe(200);
      expect(response.body.id).toBe(responsePost.body.id);
    });
  });

  describe("Delete a project", () => {
    it("Successfully deletes a project", async () => {
      //     const responsePost = await request(app)
      //         .post("/projects")
      //         .send(testProjectData)
      const response = await request(app).delete("/projects/3");
      const projects = await Project.findAll();
      expect(response.statusCode).toEqual(200);
      expect(projects.length).toEqual(projectsLength - 1);
    });
  });
});