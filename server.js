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
 * Trusted local node configuration for API call
 */
router.post('/config', (req, res) => {

	console.log('/config POST');
	console.log(req.body);

	// toDo check if node is running (check if is in sync?)
	// toDo save a local json with infos

});

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
