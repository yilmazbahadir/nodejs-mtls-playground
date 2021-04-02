const https = require('https');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const serverUrl = 'https://localhost:7880/authenticate';

const certFile = path.resolve(__dirname, `certs2/controller-node.crt.pem`);
const keyFile = path.resolve(__dirname, `certs2/controller-node.key.pem`);
const caCertFile = path.resolve(__dirname, `certs2/controller-ca.crt.pem`);

const agent = new https.Agent({
	cert: fs.readFileSync(certFile),
	key: fs.readFileSync(keyFile),
	ca: fs.readFileSync(caCertFile),
	rejectUnauthorized: false,
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
