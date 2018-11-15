const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const config = require('config');
const logger = require('./utils/logger');

const port = config.get('port');

//body parser and cors
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => res.send('Hello World!'))
app.post('/send', require('./routes/send'));

app.listen(port, () => logger.info(`email service listening on port ${port}!`))