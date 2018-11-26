const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const logger = require('../utils/logger');

const Email = require("../models/email");

const options = {
  auth: {
    api_key: process.env.SENDGRID_API_KEY,
  }
};

const mailer = nodemailer.createTransport(sgTransport(options));

exports.send_email = (req, res, err) => {
  if (err) {
    logger.error('Error making request to emailController', err);
    throw err;
  };

  const { to, from, subject, text } = req.body
  const email = {
    to,
    from,
    subject,
    text,
    html: '<b>Hello world</b>',
    sent: false,
  };

  const savedEmail = new Email(email);
  let id;

  savedEmail.save((err, res) => {
    if (err) {
      logger.error(`Error saving email object to MongoDB: ${err}`);
      throw err;
    }

    id = res._id;
    logger.info('saved to mongoDB', id);
  });

  mailer.sendMail(email, (err, sendGridRes) => {
    if (err || sendGridRes.message !== 'success') {
      logger.error('An error has occurred while attempting to send email: ', err, sendGridRes);
      res.sendStatus(500);
      throw(err || sendGridRes);
    }

    Email.findOneAndUpdate({_id: id}, { sent: true }, ((err, res) => {
      if (err) {
        logger.error('Error saving email to MongoDB', err);
        res.sendStatus(500);
        throw err;
      }
      logger.info('Saved email')
    }))

    logger.info(`Sendgrid responded with: ${sendGridRes.message}`);
    res.sendStatus(200);
  });
};

// Display list of all emails.
exports.get_emails = (req, res, next) => {
  Email.find().exec((err, emails) => {
    if (err) {
      res.send({ error: err });
      return next(err);
    }
    // Successful, so send data
    res.type("json");
    res.status(200);
    return res.json({ emails });
  });
};

// Get email based on ID.
exports.get_single_email = (req, res, next) => {
  if (!req.params.id) {
    res.status(500).json({ message: "No email supplied in request" });
  };
  const id = req.params.id;
  Email.findOne({
    _id: id
  }).exec((err, emails) => {
    if (err) {
      res.send({ error: err });
      return next(err);
    }
    // Successful, so send data
    res.type("json");
    res.status(200);
    return res.json({ emails });
  });
};

// Handle request for EMAILS by a given email address
exports.get_user_emails = (req, res) => {
  if (!req.params.email) {
    res.status(500).json({ message: "No email supplied in request" });
  };
  const userEmail = req.params.email;
  Email.find(
    { to: userEmail },
  ).exec((err, emails) => {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

    res.type("json");
    res.status(200);
    return res.json({ emails });
  });
};
