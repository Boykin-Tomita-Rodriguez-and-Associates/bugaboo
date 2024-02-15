const request = require("supertest");
const app = require("../server/app");
const { User, Project, Bug } = require("../server/models/index");
const { describe, test, expect } = require("@jest/globals");
// const { db } = require("../server/db");
const { seed } = require("../server/seed");
// const { projects, users, bugs } = require("../server/seedData");
// const bugRouter = require("../server/routes/bug");

describe("Bug route testing", () => {
    const testBugData = {
      error: "You buggin' what? You buggin' who? You buggin' me (bug a boo)",
    };
  
    beforeEach(async () => {
      await seed();
      const bugs = await Project.findAll();
      bugLength = bugs.length;
    });
  
    describe("Get all bugs for a project", () => {
      it("successfully retrieves a project's bugs", async () => {
        const projectBugs = await Bug.findAll({
            where: {
                projectId: 1
            }
        });
        const response = await request(app).get("/projects/1/bugs");
  
        expect(response.statusCode).toBe(200);
        expect(JSON.stringify(response.body)).toEqual(JSON.stringify(projectBugs));
      });
    });

    describe("Get a single bug", ()=>{
        it("retrieves the correct bug", async()=>{
            const bug = await Bug.findByPk(1); 
            const response = await request(app).get("/projects/1/bugs/1");

            expect(response.statusCode).toBe(200);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(bug))
        });
    });
});