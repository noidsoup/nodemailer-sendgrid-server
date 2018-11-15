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

const send = (req, res, next) => {
  emailAddress = req.body.email;
  if (emailAddress === undefined) {
    logger.error('An error has occurred: the email address is undefined');
    res.send('the email address is undefined');
    return next(false);
  }

  var email = {
    from: 'web@heliosinteractive.com',
    to: req.body.email,
    subject: 'Hello',
    text: 'Hello world',
    html: '<b>Hello world</b>'
  };

  mailer.sendMail(email, (err, sendGridRes) => {
    if (err || sendGridRes.message !== 'success') {
      logger.error('An error has occurred while attempting to send email: ', err, sendGridRes);
      return next((err || sendGridRes), false);
    }
    logger.info(`Sendgrid responded with: ${sendGridRes.message}`);
    res.send(`${sendGridRes.message}!`);
  });
};

module.exports = send;
