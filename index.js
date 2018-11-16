const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const config = require('config');
const logger = require('./utils/logger');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/send', require('./routes/send'));

const port = config.get('port');
app.listen(port, () => logger.info(`email service listening on port ${port}!`))