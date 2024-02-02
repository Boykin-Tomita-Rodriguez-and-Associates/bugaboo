const faker = require('@faker-js/faker')

const users = [
    {email: "dummy@gmail.com", password: 1234},
    {email: faker.internet.email(), password: 1234},
    {email: faker.internet.email(), password: 12345}
];
const projects = [
    {name: project1},
    {name: project2},
    {name: project3},
];

const bugs = [
    { error: faker.hacker.phrase() },
    { error: faker.hacker.phrase() },
    { error: faker.hacker.phrase() },
    { error: faker.hacker.phrase() }

];

module.exports = {
    users,
    projects,
    bugs
}