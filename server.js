"use strict";

const express 		= require ('express');
const lisk 			= require ('liskapi');
const bodyParser 	= require('body-parser');

const app = express ();

app.use (bodyParser.json({ type: 'application/json' }));
app.use (express.static('.'));

const router = express.Router ();

/**
 * Trusted local node configuration for API call
 */
router.post('/config', (req, res) => {

	console.log('/config API');
	console.log(req.body);

	// toDo check if node is running (check if is in sync?)
	// toDo save a local json with infos

});

app.use ('/api', router);

app.listen (8082);
