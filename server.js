"use strict";
const express 		= require ('express');
const bodyParser 	= require('body-parser');
const fs = require('fs');
const Mnemonic = require('bitcore-mnemonic');

const app = express ();

app.use (bodyParser.json({ type: 'application/json' }));
app.use (express.static('.'));

const router = express.Router ();

/**
 * Trusted local node configuration API call
 */
router.post('/node', (req, res) => {

	// toDo we could check if the requested node is good or not / sync or not
	console.log('/node POST');

	let data = {
		"node":req.body
	}

	fs.writeFile('data/config.json', JSON.stringify (data), (err,data) => {
		if(!err) {
			res.send({
				"message":"node configuration ok",
				"redirect":"/wallet"
			})
		} else {
			res.send({
				"message":"something wrong saving the data",
				"redirect":"/"
			})
		}
	});

});

/**
 * Your personal wallet
 */
router.post('/wallet', (req, res) => {

	console.log('/config POST');

	try {
		let config = JSON.parse (fs.readFileSync('data/config.json', 'utf8'));
		config["wallet"] = req.body;
		fs.writeFile('data/config.json', JSON.stringify (config), (err,data) => {
			if(!err) {
				res.send({
					"message":"wallet configuration ok",
					"redirect":"/main"
				})
			} else {
				res.send({
					"message":"something wrong saving the data",
					"redirect":"/"
				})
			}
		});
	} catch (err) {
		// error loading
		// toDo return redirect to /
	}
});

/**
 * Check configuration API call
 */
router.get('/config', (req, res) => {

	console.log("/config GET");

	// the app has a config?
	try {
		// yes
		let config = JSON.parse (fs.readFileSync('data/config.json', 'utf8'));

		// check if all parts are filled
		// node is filled?
		if(config.node) {
			// node filled
			// wallet is filled?
			if(config.wallet) {
				// wallet filled
				res.send({
					"message":"node and wallet have been configured",
					"redirect":"/main"
				})
			} else {
				res.send({
					"message":"wallet must be configured",
					"redirect":"/wallet"
				})
			}
		} else {
			res.send({
				"message":"node must be configured",
				"redirect":"/node"
			})
		}
	} catch (err) {
		res.send({
			"message":"no configuration found",
			"redirect":"/node"
		})
	}
});

/**
 * Create Multi-signature account API call
 */

router.post('/multisig', (req, res) => {
	console.log('/multisig POST');
	console.log(req.body.name);
	console.log(req.body.wallet);

	// toDo create a new wallet with the given secret
	// toDo make a tx from the main account to the created one
	// toDo first account became multi-signature

	// if node setted
	try {

		let config = JSON.parse (fs.readFileSync('data/config.json', 'utf8'));

		if(config.node) {

			const lisk = require ('liskapi')(config.node);

			lisk.getSyncStatus ().call ()
				.then ((res) => {
					console.log (`Get sync status data\n ${JSON.stringify (res)}`);
				})
				.catch ((err) => {
					console.log ('Got an error', err);
				});
		}

	} catch (err) {
		res.send({
			"message":"no configuration found",
			"redirect":"/node"
		})
	}
})

/**
 * Generate mnemonic pass API call
 */

router.get('/mnemonic', (req, res) => {

	console.log("/mnemonic GET");

	res.send({
		"secret":new Mnemonic(Mnemonic.Words.ENGLISH).toString(),
	})

})

app.use ('/api', router);

app.listen (8082);
