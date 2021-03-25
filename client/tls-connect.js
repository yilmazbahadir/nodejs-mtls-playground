const fs = require('fs');
const path = require('path');
const tls = require('tls');


const certFile = path.resolve(__dirname, `certs/controller.crt.pem`);
const keyFile = path.resolve(__dirname, `certs/controller.key.pem`);
const caCertFile = path.resolve(__dirname, `certs/node.ca.cert.pem`);

const contextOptions = {
	cert: fs.readFileSync(certFile),
	key: fs.readFileSync(keyFile),
	ca: fs.readFileSync(caCertFile),
};

const secureContext = tls.createSecureContext(contextOptions);

const connectionOptions = {
	host: 'localhost',
	port: 7880,
	secureContext,
	checkServerIdentity: (
		host,
		cert,
	) => {
		console.log('CHECK IDENTITY', cert);
		// if (host !== cert.subject.CN) {
		//     throw new Error(
		//        `Servername ${host} does not match CN ${cert.subject.CN}`,
		//     );
		// }
		// const obj = asn1.fromDer(cert.raw.toString('binary'));
		// const certificate = pki.certificateFromAsn1(obj);
		// console.log('PUBLIC', certificate.publicKey);
		return undefined;
	},
	// skip hostname checks since this is not a web-https case
};
const serverSocket = tls.connect(connectionOptions);
serverSocket.on('secureConnect', (event) => {
	console.log('Connected!', event);
});
serverSocket.on('session', (event) => {
	console.log('Session!', event);
});
serverSocket.on('connection', (event) => {
	console.log('connection!', event);
});
serverSocket.on('OCSPResponse', (event) => {
	console.log('OCSPResponse!', event);
});