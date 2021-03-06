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
				"message":"Node configuration ok",
				"redirect":"/wallet",
				"type":"success"
			})
		} else {
			res.send({
				"message":"Something wrong saving the data",
				"redirect":"/",
				"type":"error"
			})
		}
	});

});

/**
 * Your personal wallet
 */
router.post('/wallet', (req, res) => {

	console.log('/config POST');

	// try {
		let config = JSON.parse (fs.readFileSync('data/config.json', 'utf8'));

		let lisk = require ('liskapi')(config.node);

		lisk.getAccount ( { address: req.body.address } )
			.call ()
			.then ((r) => {
				console.log (`Getting an account\n ${JSON.stringify (r)}`);
				config[req.body.name] = {
					address:req.body.address,
					secret:req.body.secret,
					secondSecret:req.body.secondSecret
				};
				config[req.body.name].publicKey = r.account.publicKey;
				fs.writeFile('data/config.json', JSON.stringify (config), (err,data) => {
					if(!err) {
						res.send({
							"message":"Wallet configuration ok",
							"redirect":"/main",
							"type":"success"
						})
					} else {
						res.send({
							"message":"Something wrong saving the data",
							"redirect":"/",
							"type":"error"
						})
					}
				});
			})
			.catch ((err) => {
				console.log ('Got an error getting an account\n', err);
				res.send({
					"message":"Got an error getting the account, " + err,
					"redirect":"/",
					"type":"error"
				})
			});

	// } catch (err) {
		// error loading
		// toDo return redirect to /
	// }
});

/**
 * Make tx with given wallet
 */
router.post('/transaction', (req, res) => {

	console.log('/transaction POST');

	// try {
	let config = JSON.parse (fs.readFileSync('data/config.json', 'utf8'));
	if(config.node && req.body.wallet in config) {
		// console.log(req.body);
		let lisk = require ('liskapi')(config.node);

		let params = {
			secret:config[req.body.wallet].secret,
			amount:(req.body.amount*100000000) ,
			recipientId:req.body.recipient,
			publicKey:config[req.body.wallet].publicKey,
		};

		if(config[req.body.wallet].secondSecret != "")
			params.secondSecret = config[req.body.wallet].secondSecret;

		console.log(params);

		lisk.sendTransaction ()
			.data ( params )
			.call ()
			.then ((r) => {
				console.log (`Put for sending LSK\n ${JSON.stringify (r)}`);
				res.send({
					"message":"Transaction success",
					"redirect":"/main",
					"type":"success"
				})
			})
			.catch ((err) => {
				console.log ('Got an error sending LSK\n', err);
				res.send({
					"message":"Transaction error, " + err,
					"redirect":"/main",
					"type":"error"
				})
			});
	}

	// } catch (err) {
		// error loading
		// toDo return redirect to /
	// }
});


/**
 * Get all wallets API call
 */
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

	// ToDo test it

	// the app has a config?
	try {
		// yes
		let config = JSON.parse (fs.readFileSync('data/config.json', 'utf8'));

		// check if all parts are filled
		// node is filled?
		if(config.node) {
			// node filled
			// wallet is filled?
			if(Object.keys(config).length > 1) {
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

	// try {

		let config = JSON.parse (fs.readFileSync('data/config.json', 'utf8'));

		if(config.node && !(req.body.name in config)) {

			let lisk = require ('liskapi')(config.node);

			lisk.openAccount ()
				.data ( { secret: req.body.wallet.secret } )
				.call ()
				.then ((r) => {
					console.log (`Post for opening an account\n ${JSON.stringify (r)}`);
					let account = r.account.address;
					let params = {
						secret: config[req.body.walletToBeCharged].secret,
						amount: 2500000000,
						recipientId: account,
						publicKey: config[req.body.walletToBeCharged].publicKey
					};
					if(config[req.body.walletToBeCharged].secondSecret != "")
						params.secondSecret = config[req.body.walletToBeCharged].secondSecret;

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
											config[req.body.name].address = account;
											config[req.body.name].publicKey = r.account.publicKey;
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

	// } catch (err) {
	// 	res.send({
	// 		"message":"no configuration found",
	// 		"redirect":"/node"
	// 	})
	// }
})

/**
 * Add wallet API call
 */
router.post('/add', (req, res) => {
	let config = JSON.parse(fs.readFileSync('data/config.json', 'utf8'));
	if (config.node && !(req.body.name in config)) {

		let lisk = require ('liskapi')(config.node);

		lisk.getAccount ( { address: req.body.address } )
			.call ()
			.then ((r) => {
				console.log (`Getting an account\n ${JSON.stringify (r)}`);
				config[req.body.name] = {address:req.body.address,secret:req.body.secret,secondSecret:req.body.second,publicKey:r.account.publicKey};
				fs.writeFile('data/config.json', JSON.stringify (config), (err,data) => {
					if(!err) {
						res.send({
							"message":"Wallet added",
							"redirect":"/main",
							"type":"success"
						})
					} else {
						res.send({
							"message":"Something wrong saving the data",
							"redirect":"/",
							"type":"error"
						})
					}
				});
			})
			.catch ((err) => {
				console.log ('Got an error getting the account\n', err);
				res.send({
					"message":"Got an error getting the account, " + err,
					"redirect":"/main",
					"type":"error"
				})
			});
	}
});

/**
 * Sign tx API call
 */
router.post('/sign', (req, res) => {
	// try {

		let config = JSON.parse(fs.readFileSync('data/config.json', 'utf8'));

		if (config.node && req.body.wallet in config) {

			let lisk = require ('liskapi')(config.node);

			let params = {
				secret:config[req.body.wallet].secret,
				// publicKey:config[req.body.wallet].publickey,
				transactionId:req.body.transactionID
			};

			// if(config[req.body.wallet].secondSecret != "") params.secondSecret = config[req.body.wallet].secondSecret;

			lisk.signTransaction ()
				.data ( params )
				.call ()
				.then ((r) => {
					console.log (`Post for signing a multi-sig creation txID\n ${JSON.stringify (r)}`);
					res.send({
						"message":"Transaction signed",
						"redirect":"/main",
						"type":"success"
					})
				})
				.catch ((err) => {
					console.log ('Got an error signing a multi-sig creation txID\n', err);
					res.send({
						"message":"Got an error signing a multi-sig creation txID, " + err,
						"redirect":"/main",
						"type":"error"
					})
				});
		}
	// } catch (err) {
	// 	res.send({
	// 		"message": "No configuration found",
	// 		"redirect": "/node"
	// 	})
	// }
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

/**
 * Get infos for all wallets added
 */
router.get('/walletsandinfos', (req, res) => {
	let config = JSON.parse(fs.readFileSync('data/config.json', 'utf8'));
	let accounts = [];
	if(config.node){
		let lisk = require ('liskapi')(config.node);
		for(let account in config) {
			if(config[account].address) {
				lisk.getAccount ( { address: config[account].address } )
					.call ()
					.then ((r) => {
						// console.log (`Getting an account\n ${JSON.stringify (r)}`);
						r.account.name = account;
						accounts.push(r.account);
						if(accounts.length == (Object.keys(config).length)-1) {
							res.send({
								"message":"Got address infos",
								"redirect":"/main",
								"type":"success",
								"data":accounts
							})
						}
					})
					.catch ((err) => {
						console.log ('Got an error getting an account\n', err);
						res.send({
							"message":"Got an error getting an accounts, " + err,
							"redirect":"/main",
							"type":"error"
						})
					});
			}
		}
	}
})

router.post('/removeaccount', (req, res) => {
	console.log(req.body.accountName);
	let config = JSON.parse(fs.readFileSync('data/config.json', 'utf8'));
	if(req.body.accountName in config) {
		delete config[req.body.accountName];
		fs.writeFile('data/config.json', JSON.stringify (config), (err,data) => {
			if(!err) {
				res.send({
					"message":"Wallet removed",
					"redirect":"/main",
					"type":"success"
				})
			} else {
				res.send({
					"message":"Something wrong removing the wallet",
					"redirect":"/main",
					"type":"error"
				})
			}
		});
	}


})

app.use ('/api', router);

app.listen (8082);
