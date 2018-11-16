const logger = require('../utils/logger');
const config = require('config');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const options = {
  auth: {
    api_key: config.get('sendgrid_api_key')
  }
};

var mailer = nodemailer.createTransport(sgTransport(options));

const emailController = (req, res, next) => {
  const { email, from, subject, text } = req.body
  const emailObject = {
    to: email,
    from,
    subject,
    text,
    html: '<b>Hello world</b>'
  };

  mailer.sendMail(emailObject, (err, sendGridRes) => {
    if (err || sendGridRes.message !== 'success') {
      logger.error('An error has occurred while attempting to send email: ', err, sendGridRes);
      return next((err || sendGridRes), false);
    }
    logger.info(`Sendgrid responded with: ${sendGridRes.message}`);
    res.send(`${sendGridRes.message}!`);
  });
};

module.exports = emailController;
