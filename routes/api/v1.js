const express = require("express");
const router = express.Router();
const { check, checkSchema, validationResult } = require("express-validator/check");

/* Main routing engine.
* Takes all requests before forwarding to the approriate controller.
* */

// Bring in controller modules.
const emailController = require('../../controllers/emailController');

/* handles all requests comming into /api.
* should be used to share information about major changes to the APIs.
*/
router.get("/", (req, res) => {
  res.send("Email API");
});

/* handles all requests comming into /api/v1
* should be used to share information about this version of the API
* */
router.get("/v1", (req, res) => {
  res.send(
    "EMAIL API Version 1.0.0."
  );
});

// SEND EMAIL
router.post('/v1/emails/', [
  [
    check('to').exists(),
    check('from').exists(),
    check('subject').exists(),
    check('body').exists(),
  ],

  check("to")
    .isEmail()
    .isString()
    .not().isEmpty()
    .trim()
    .escape(),
  check("from")
    .isEmail()
    .isString()
    .not().isEmpty()
    .trim()
    .escape(),
  check("subject")
    .isString()
    .isLength({ max: 78 })
    .not().isEmpty()
    .trim()
    .escape(),
  check("body")
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

  emailController.send_email(req, res);
});

// GET EMAILS
router.get('/v1/emails', (req, res) => {
  emailController.get_emails(req, res);
});

var Schema = {

}

// GET all emails associated with an EMAIL address
router.get('/v1/emails/:email/messages', [
  check('email').isEmail(),
  checkSchema({"email": {
    matches: {
      options: [/\b(?:heliosinteractive|freeman)\b/],
      errorMessage: "Invalid email domain"
    }
  }}),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  emailController.get_user_emails(req, res);
});

router.get('/v1/emails/:id', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  emailController.get_single_email(req, res);
});

module.exports = router;