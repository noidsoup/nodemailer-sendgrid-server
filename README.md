# nodemailer-sendgrid-server
> send an email via nodemailer/sendgrid and store the record in a mongo DB

### Pre-req
You must be running mongo DB locally on your machine in order for the application to run.

### Setup
```
npm install
npm start
```

Create a .env file and populate with your keys and values.

Example: 
```
NODE_ENV=dev
SERVER_PORT=3001
SENDGRID_API_KEY=SG.##############################
```

### Usage
```
POST {{url}}/emails/
```
A demonstration of sending an email via sendgrid and nodemailer. Every email is saved to a local mongo DB, in a collection called "Email"

In order to send an email, start the server and send a post request to the endpoint:

```
{
  "to": "nicholas.eymann@xyz.com",
  "from": "web@xyz.com",
  "subject": "hello",
  "body": "world"
}
```

Gets all emails from database
```
GET {{url}}/emails/
```

Gets user's emails via their address
```
GET {{url}}/emails/{{email address}}/messages
```

Gets an email message via ID
```
GET {{url}}/emails/:id
```

