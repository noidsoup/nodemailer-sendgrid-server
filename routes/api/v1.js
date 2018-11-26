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
    .isLength({ max: 78 })
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

  emailController.send_email(req, res);
});

// GET EMAILS
// TODO: does this validation? Can a GET request be dangerous?
router.get('/v1/emails', (req, res) => {
  emailController.get_emails(req, res);
});

// GET all emails associated with an EMAIL address
router.get('/v1/emails/:email/messages', checkSchema({
  email: {
    in: ['params'],
    isEmail: {
      errorMessage: 'Not a valid email address'
    },
    isLength: {
      errorMessage: 'Email addresses can be no longer than 254 characters (RFC 2821)',
      // Multiple options would be expressed as an array
      options: { max: 320 }
    },
  },
}), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  emailController.get_user_emails(req, res);
});

router.get('/v1/emails/:id', checkSchema({
  id: {
    in: ['params'],
    isString: {
      errorMessage: 'Incorrect ID type',
    },
    isLength: {
      errorMessage: 'ID is too long',
      options: { max: 24 }
    },
  },
}), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  emailController.get_single_email(req, res);
});

module.exports = router;