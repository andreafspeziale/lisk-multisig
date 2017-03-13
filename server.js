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

router.get('/wallets', (req, res) => {
	try {
		// yes
		let config = JSON.parse (fs.readFileSync('data/config.json', 'utf8'));
		let wallets = [];

		for (let element in config)
			if(element != "node")
				wallets.push(element);

		res.send({
			"message":"Get all wallets",
			"data":wallets
		})
	} catch (err) {
		res.send({
			"message":"no configuration found",
			"redirect":"/node"
		})
	}
})

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

	// toDo create a new wallet with the given secret
	// toDo make a tx from the main account to the created one
	// toDo first account became multi-signature

	// if node setted
	try {

		let config = JSON.parse (fs.readFileSync('data/config.json', 'utf8'));

		if(config.node && !(req.body.name in config)) {

			const lisk = require ('liskapi')(config.node);

			lisk.openAccount ()
				.data ( { secret: req.body.wallet.secret } )
				.call ()
				.then ((r) => {
					console.log (`Post for opening an account\n ${JSON.stringify (r)}`);
					let account = r.account.address;
					let params = {
						secret: config.wallet.secret,
						amount: 3000000000,
						recipientId: account,
						publicKey: config.wallet.publickey
					};
					if(config.wallet.secondSecret != "")
						params[secondSecret] = config.wallet.secondSecret;

					// create the multisig-one
					setTimeout(function () {
						lisk.sendTransaction ()
							.data (params)
							.call ()
							.then ((r2) => {
								console.log (`Put for sending LSK\n ${JSON.stringify (r2)}`);
								setTimeout(function () {
									lisk.createMultiSignatureAccount ()
										.data ( { secret: req.body.wallet.secret,
											lifetime: req.body.wallet.lifetime,
											min: parseInt(req.body.wallet.min),
											keysgroup: req.body.wallet.publicKeys
										} )
										.call ()
										.then ((r3) => {
											console.log (`Put for creating a multi-sig account\n ${JSON.stringify (r3)}`);

											// if everything is ok save the wallet data
											config[req.body.name] = req.body.wallet;
											fs.writeFile('data/config.json', JSON.stringify (config), (err,data) => {
												if(!err) {
													res.send({
														"message":"Multi-signature account created",
														"redirect":"/main",
			 											"type":"success"
													})
												} else {
													res.send({
														"message":"Something wrong saving the Multi-signature account data",
														"redirect":"/",
														"type":"error"
													})
												}
											});
										})
										.catch ((err) => {
											console.log ('Got an error creating a multi-sig account\n', err);
											res.send({
												"message":"Something wrong creating a multi-sig account, " + err,
												"redirect":"/main",
												"type":"error"
											})
										});
								}, 30000);
							})
							.catch ((err) => {
								console.log ('Got an error sending LSK\n', err);
								res.send({
									"message":"Something wrong sending LSK, " + err,
									"redirect":"/main",
									"type":"error"
								})
							});
					}, 30000);
				})
				.catch ((err) => {
					console.log ('Got an error opening an account\n', err);
					res.send({
						"message":"Something wrong opening an account, " + err,
						"redirect":"/main",
						"type":"error"
					})
				});
		} else {
			res.send({
				"message":"Wallet already exists",
				"redirect":"/main",
				"type":"error"
			})
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
