const https = require('https');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const serverUrl = 'https://localhost:7880/authenticate';

const certFile = path.resolve(__dirname, `certs/controller.crt.pem`);
const keyFile = path.resolve(__dirname, `certs/controller.key.pem`);
//const caCertFile = path.resolve(__dirname, `certs/node.ca.cert.pem`);

const agent = new https.Agent({
	cert: fs.readFileSync(certFile),
	key: fs.readFileSync(keyFile),
	//ca: none,
	rejectUnauthorized: true,
	checkServerIdentity: (
		host,
		cert,
	) => {
		console.log('CHECK IDENTITY', cert);
		return undefined;
	},
});

let opts = { agent: agent };

fetch(serverUrl, opts)
	.then(res => res.text())
    .then(json => console.log(json));
