"use strict";

const express 		= require ('express');
const lisk 			= require ('liskapi');
const bodyParser 	= require('body-parser');
const fs = require('fs');

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
 * Your wallet
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

app.use ('/api', router);

app.listen (8082);
