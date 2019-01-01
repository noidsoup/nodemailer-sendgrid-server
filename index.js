// loads evnironment variables defined in .env
require("dotenv").config();

// config to switch between development, staging, or production
const config = require("./config");

const express = require("express");
const bodyParser = require('body-parser');
// winston for logging
const logger = require('./utils/logger');

// establishes api routes
const api = require("./routes/api/v1");

// sets up the express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// sets up mongoose connection
const mongoose = require("mongoose");
const {
  db: { host, port, name },
} = config.dev;

// your mongoDB must be running to use this application
const mongoDB = process.env.MONGODB_URI || `mongodb://${host}:${port}/${name}`;
mongoose.Promise = global.Promise;
mongoose.connect(mongoDB, { useNewUrlParser: true, useFindAndModify: false });
const db = mongoose.connection;
db.on("connected", () => {
  logger.info(`using ${db.name}`);
});
db.on("error", logger.error.bind(logger, "MongoDB connection error;"));

app.use("/api", api);

app.listen(process.env.SERVER_PORT, () => logger.info(`email service listening on port ${process.env.SERVER_PORT}!`))