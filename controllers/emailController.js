const logger = require('../utils/logger');
const Email = require("../models/email");
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const options = {
  auth: {
    api_key: process.env.SENDGRID_API_KEY,
  }
};

const mailer = nodemailer.createTransport(sgTransport(options));

const emailController = (req, res, err) => {
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

module.exports = emailController;
