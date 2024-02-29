const { faker } = require("@faker-js/faker");

const users = [
  { email: "dummy@gmail.com", password: "1234!Adc", isAdmin: true },
  { email: "dumm2@gmail.com", password: "1234!Adc" },
  { email: faker.internet.email(), password: "12345" },
];
const projects = [
  { name: "project1", userId: 1 },
  { name: "project2", userId: 2 },
  { name: "project3", userId: 2 },
];

const bugs = [
  { error: faker.hacker.phrase(), projectId: 1 },
  { error: faker.hacker.phrase(), projectId: 2 },
  { error: faker.hacker.phrase(), projectId: 2 },
  { error: faker.hacker.phrase(), projectId: 3 },
];

module.exports = {
  users,
  projects,
  bugs,
};
