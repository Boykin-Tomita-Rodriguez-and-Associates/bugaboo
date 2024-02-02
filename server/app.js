require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');

//add routers here eventually 

app.use(morgan('dev'));

