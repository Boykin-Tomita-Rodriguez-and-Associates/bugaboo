require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const projectRouter = require('./routes/project');
const userRouter = require('./routes/user')

//add routers here eventually 

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//routers
app.use('/projects', projectRouter);
app.use('/users', userRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).send({error: '404 - Not Found', message: 'No route found for the requested URL'});
  });

  module.exports = app;