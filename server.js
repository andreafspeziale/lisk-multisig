"use strict";

const express 		= require ('express');
const lisk 			= require ('liskapi');
const bodyParser 	= require('body-parser');

const app = express ();

app.use (bodyParser.json({ type: 'application/*+json' }));
app.use (express.static('.'));

const router = express.Router (); 

router.get('/:publicKey/accounts', (req, res) => {
	lisk.getMultiSignatureAccounts ({ publicKey: req.params.publicKey }).call ()
	.then ((res) => {
		res.status (200);
		res.json (res);
	}).catch ((err) => {
		res.status (500);
		res.json (err);
	});
});

app.use ('/api', router);

app.listen (8082);
