# nodemailer-sendgrid-server
> send an email via nodemailer/sendgrid and store the record in a mongo DB

### Pre-req
You must be running mongo DB locally on your machine in order for the application to run.

### Setup
```
npm install
npm start
'''

Create a .env file and populate with your keys.

Example: 

NODE_ENV=dev
SERVER_PORT=3001
SENDGRID_API_KEY=SG.##############################

### Usage
A demonstration of sending an email via sendgrid and nodemailer. Every email is saved to a local mongo DB, in a collection called "Email"

In order to send an email,  