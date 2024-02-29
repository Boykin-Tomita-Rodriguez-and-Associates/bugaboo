require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const projectRouter = require("./routes/project");
const userRouter = require("./routes/user");
const { auth } = require("express-openid-connect");
const { currentUser } = require("../middleware/currentUser");

/* Apply authentication middleware */
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

/* Auth router attaches /login, /logout, and /callback routes to the baseURL */
app.use(auth(config));

/* Middleware */
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* Routers */
app.use("/projects", projectRouter);
app.use("/users", userRouter);

/* Entry or exit point after user logs in or logs out */
app.get("/", currentUser, async (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

module.exports = app;
