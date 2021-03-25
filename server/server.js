const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');

const opts = {
	key: fs.readFileSync(path.join(__dirname, 'certs/node.key.pem')),
	cert: fs.readFileSync(path.join(__dirname, 'certs/node.full.crt.pem')),
	requestCert: true,
	rejectUnauthorized: false,
	ca: [
		fs.readFileSync(path.join(__dirname, 'certs/controller-ca-cert.pem'))
	]
};

const app = express();

app.get('/', (req, res) => {
	res.send('<a href="/authenticate">Log in using client certificate</a>');
});

app.get('/authenticate', (req, res) => {
	const cert = req.socket.getPeerCertificate();

	if (req.client.authorized) {
		res.send(`Hello ${cert.subject.CN}, your certificate was issued by ${cert.issuer.CN}!`);

	} else if (cert.subject) {
		res.status(403)
			 .send(`Sorry ${cert.subject.CN}, certificates from ${cert.issuer.CN} are not welcome here.`);

	} else {
		res.status(401)
		   .send(`Sorry, but you need to provide a client certificate to continue.`);
	}
});

// listens on https
https.createServer(opts, app).listen(7880, () => {
	const msg = `SERVER ONLINE at https://localhost:7880
To see demo, run in a new session:

  - \`npm run valid-client\`
  - \`npm run invalid-client\`
  - \`npm run tls-connect\`
  - \`npm run tls-connect-no-ca\`
`
	console.log(msg)
});