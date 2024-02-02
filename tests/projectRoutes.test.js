const request = require("supertest");
const app = require('../server/app');
const { User, Project, Bug } = require('../server/models/index');
const { describe, test, expect } = require("@jest/globals");
const { db } = require("../server/db");
const {seed} = require("../server/seed");
const { projects, users, bugs } = require('../server/seedData');

describe("Project testing", () => {
    beforeEach(async () => {
      await seed();
    });

    describe("Get all projects", ()=>{
        it("successfully retrieves all projects", async()=>{
            const allProjects = await Project.findAll();
            const response = await request(app).get('/projects');
            
            expect(response.statusCode).toBe(200);
            expect(response.body).toBe(JSON.stringify(allProjects));
        })
    })
})