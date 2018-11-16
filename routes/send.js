const { check, validationResult } = require('express-validator/check');
const emailController = require('../controllers/emailController');
const express = require('express');
const router = express.Router();

router.post('/send', [
  [
    check('to').exists(),
    check('from').exists(),
    check('subject').exists(),
    check('text').exists(),
  ],

  check("to")
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

  emailController(req, res);
});

module.exports = router;
