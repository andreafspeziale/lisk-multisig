#Lisk Multisig Account Manager
> With love liskit (10310263204519541551L) and dakk (2324852447570841050L) delegates

This projects aims to release a light and local Lisk Multi-signature Account manager.

The web application will ask you for a:

    A node that you trust to use for API calls
    A main wallet account in order to be able to create a new Multi-signature Account
    
All the infos are stored locally on your server/machine.
 
Once the set-up is completed you will be redirected to a main page with all the functionalities.

Enjoy!

#Use it!
###Req

    nodeJs / npm
    bower
    grunt
    
###Install

    $ bower install
    $ npm install
    $ grunt build
    
###Run

    $ node server.js
    
###Use
Visit localhost:8082 and start setting a Lisk node to use it as gateway to the Lisk blockchain

![first wizard step](http://i66.tinypic.com/264iddk.jpg)

Now add at least one valid account to the application

![second wizard step](http://i65.tinypic.com/2j2u4wo.png)

Ok! Now you can access to all the functionalities!

![third wizard step](http://i64.tinypic.com/b6se1u.png)

#Developing
###DevReq

	node
	bower
	grunt

###Install

	$ bower install
	$ npm install

###Develop

	$ grunt
	
###Run

``` node server.js ```
