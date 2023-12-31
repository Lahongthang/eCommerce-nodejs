require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./v1/routes/index.route');

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.urlencoded({
    extended: true,
}));

app.use(express.json());

app.use(morgan('combined'));

app.use(routes);

module.exports = app;