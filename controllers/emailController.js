const logger = require('../utils/logger');
const Email = require("../models/email");
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const options = {
  auth: {
    api_key: process.env.SENDGRID_API_KEY,
  }
};

var mailer = nodemailer.createTransport(sgTransport(options));

const emailController = (req, res, err) => {
  if (err) {
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
      const error = `Error saving email object to MongoDB: ${err}`;
      logger.error(error);
      throw error;
    }

    id = res._id;
    logger.info('saved to mongoDB', id);
  });

  mailer.sendMail(email, (err, sendGridRes) => {
    if (err || sendGridRes.message !== 'success') {
      logger.error('An error has occurred while attempting to send email: ', err, sendGridRes);
      throw(err || sendGridRes);
    }

    Email.findOneAndUpdate({_id: id}, { sent: true }, ((err, res) => {
      if (err) {
        logger.error('Error saving email to MongoDB', err);
        throw err;
      }
      logger.info('saved record with id of', id)
    }))

    logger.info(`Sendgrid responded with: ${sendGridRes.message}`);
    res.send(`${sendGridRes.message}!`);
  });
};

module.exports = emailController;
