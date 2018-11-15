const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator/check');
const config = require('config');
const logger = require('./utils/logger');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const sendController = require('./controllers/sendController');
app.get('/', (req, res) => res.send('node mailer based email service'))
app.post('/send', [
  [
    check('email').exists(),
    check('from').exists(),
    check('subject').exists(),
    check('text').exists(),
  ],

  check("email")
    .isEmail()
    .isString()
    .not().isEmpty()
    .trim()
    .escape(),
  check("from")
    .isString()
    .not().isEmpty()
    .trim()
    .escape(),
  check("subject")
    .isString()
    .not().isEmpty()
    .trim()
    .escape(),
  check("text")
    .isString()
    .not().isEmpty()
    .trim()
    .escape(),
], (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  sendController(req, res);
});

const port = config.get('port');
app.listen(port, () => logger.info(`email service listening on port ${port}!`))