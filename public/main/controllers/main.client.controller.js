/**
 * Created by andreafspeziale on 03/02/17.
 */
main.controller('MainController', ['$scope', '$http', '$location', '$rootScope', 'toastr', '$uibModal','usSpinnerService',
    ($scope, $http, $location, $rootScope, toastr, $uibModal, usSpinnerService) => {

        $rootScope.waiting = false;
        $scope.keys = [''];
        $scope.txLifeTime = '';
        $scope.publicKeys = [];
        $scope.wallet = '';
        $scope.transactionID = '';
        $scope.accountName = '';
        $scope.accountSecret = '';
        $scope.accountAddress = '';
        $scope.accountSecondSecret = '';

        $scope.makeTX = () => {
            console.log("makeTX");
            if($scope.wallet == "" || $scope.txAmount == "" || $scope.txAmount < 1 || $scope.txRecipient == "")
                toastr.warning('Fill all the fields', 'Warning');
            else {
                let data = {
                    wallet:$scope.wallet,
                    recipient:$scope.txRecipient,
                    amount:$scope.txAmount
                };
                $http.post('/api/transaction', data)
                    .then((data) => {
                        $scope.modalInstance.close();
                        if(data.data.type == 'error')
                            toastr.error(data.data.message, 'Error');
                        else
                            toastr.success(data.data.message, 'Success');

                    })
                    .catch((err) => {
                        console.log('error');
                        console.log(err);
                    });
            }

        }

        $scope.addWallet = () => {
            console.log("addWallet")
            if($scope.accountName == "" || $scope.accountSecret == "" || $scope.accountAddress == "")
                toastr.warning('Fill all the fields', 'Warning');
            else {
                let data = {
                    name:$scope.accountName,
                    address:$scope.accountAddress,
                    secret:$scope.accountSecret,
                    second:$scope.accountSecondSecret
                };
                $http.post('/api/add', data)
                    .then((data) => {
                        $scope.modalInstance.close();
                        if(data.data.type == 'error')
                            toastr.error(data.data.message, 'Error');
                        else
                            toastr.success(data.data.message, 'Success');

                    })
                    .catch((err) => {
                        console.log('error');
                        console.log(err);
                    });
            }

        }


        $scope.signMultisigTx = () => {

            if($scope.wallet != '' && $scope.transactionID != '') {

                let params = {
                    "wallet":$scope.wallet,
                    "transactionID":$scope.transactionID
                };

                usSpinnerService.spin('spinner-1');
                $rootScope.waiting = true;
                $scope.modalInstance.close();

                $http.post('/api/sign', params)
                     .then((data) => {

                     usSpinnerService.stop('spinner-1');
                     $rootScope.waiting = false;

                     if(data.data.type == 'error')
                        toastr.error(data.data.message, 'Error');
                     else
                        toastr.success(data.data.message, 'Success');
                 })
                 .catch((err) => {
                     console.log('error');
                     console.log(err);
                 });

            } else {
                toastr.warning('Fill all the fields', 'Warning');
            }
        };

        $scope.createMultisig = () => {
            console.log("createMultisig");

            // check fields filled
            if( $scope.name == '' || $scope.txLifeTime <= 0 || $scope.keys.indexOf('') == 0 || $scope.minSig < 2 || $scope.minSig > $scope.keys.length || $scope.wallet == '') {

                toastr.warning('Fill all the fields', 'Warning');

            } else {

                for(var key in $scope.keys)
                    $scope.publicKeys.push('+' + $scope.keys[key])

                let params = {
                        "name":$scope.name,
                        "wallet": {
                            "secret":$scope.mnemonic,
                            "lifetime":$scope.txLifeTime,
                            "min":$scope.minSig,
                            "publicKeys":$scope.publicKeys
                        },
                        "walletToBeCharged":$scope.wallet
                };

                $rootScope.waiting = true;
                usSpinnerService.spin('spinner-1')
                $scope.modalInstance.close();

                $http.post('/api/multisig', params)
                    .then((data) => {

                        usSpinnerService.stop('spinner-1')
                        $rootScope.waiting = false;

                        if(data.data.type == 'error')
                            toastr.error(data.data.message, 'Error');
                        else
                            toastr.success(data.data.message, 'Success');

                    })
                    .catch((err) => {
                        console.log('error')
                        console.log(err)
                        usSpinnerService.stop('spinner-1')
                        $rootScope.waiting = false;
                        toastr.error(err, 'Error');
                    });

            }
        }

        $scope.createMultisigModal = () => {
            $http.get ('/api/mnemonic')
                .then ((data) => {
                    console.log("createMultisigModal");

                    $http.get ('/api/wallets')
                        .then ((d) => {
                            console.log("signTxModal");

                            $scope.wallets = d.data.data;

                            $scope.mnemonic = data.data.secret;

                            $scope.modalInstance = $uibModal.open({
                                templateUrl: '/public/main/views/modals/createMultisigModal.html',
                                controller: 'MainController',
                                backdrop: 'static',
                                scope: $scope
                            })
                        })
                        .catch((err) => {
                            console.log("Error ", err);
                        });
                })
                .catch((err) => {
                    console.log("Error ", err);
                });
        };

        $scope.signMultisigTxModal = () => {
            console.log("signMultisigTxModal");

            // get all the wallets wallet
            $http.get ('/api/wallets')
                .then ((data) => {
                    console.log("signTxModal");

                    $scope.wallets = data.data.data;

                    $scope.modalInstance = $uibModal.open({
                        templateUrl: '/public/main/views/modals/signMultisigTxModal.html',
                        controller: 'MainController',
                        backdrop: 'static',
                        scope: $scope
                    })
                })
                .catch((err) => {
                    console.log("Error ", err);
                });
        }

        $scope.makeTxModal = () => {
            console.log("makeTxModal");

            $http.get ('/api/wallets')
                .then ((data) => {

                    $scope.wallets = data.data.data;

                    $scope.modalInstance = $uibModal.open({
                        templateUrl: '/public/main/views/modals/makeTxModal.html',
                        controller: 'MainController',
                        backdrop: 'static',
                        scope: $scope
                    })
                })
                .catch((err) => {
                    console.log("Error ", err);
                });


        }

        $scope.addAccountModal = () => {
            console.log("makeTxModal");
            $scope.modalInstance = $uibModal.open({
                templateUrl: '/public/main/views/modals/addAccountModal.html',
                controller: 'MainController',
                backdrop: 'static'
            })
        }

        //ToDo make impossible to add a new row without filling the first one
        $scope.addPublicKey = () => {
            $scope.keys.push('');
        }

    }]);