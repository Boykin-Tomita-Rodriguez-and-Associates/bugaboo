require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const projectRouter = require("./routes/project");
const userRouter = require("./routes/user");
const { auth } = require("express-openid-connect");
const {User} = require("./models/index");
const {currentUser} = require("../middleware/currentUser");

// Apply authentication middleware
const { AUTH0_SECRET, AUTH0_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_BASE_URL } =
  process.env;
const config = {
  authRequired: true,
  auth0Logout: true,
  secret: AUTH0_SECRET,
  baseURL: AUTH0_AUDIENCE,
  clientID: AUTH0_CLIENT_ID,
  issuerBaseURL: AUTH0_BASE_URL,
};

// Auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// Middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routers
app.use("/projects", projectRouter);
app.use("/users", userRouter);

// 404 handler
// app.use((req, res) => {
//     res.status(404).send({error: '404 - Not Found', message: 'No route found for the requested URL'});
//   });

// req.isAuthenticated is provided from the auth router

app.get("/", currentUser, async (req, res) => {
  console.log(req.oidc.user)
  console.log("CURRENT USER: ", res.locals.user)
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
  //find User or create if they do not exist already
});

module.exports = app;