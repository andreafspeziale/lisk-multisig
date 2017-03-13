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


        $scope.signMultisigTx = () => {

            // ToDo select a wallet and sign passing which wallet

            if($scope.wallet != '' && $scope.transactionID != '') {
                console.log('ok');
            } else {
                toastr.warning('Fill all the fields', 'Warning');
            }

            /*$http.post('/api/sign', params)
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
                });*/
        };

        $scope.createMultisig = () => {
            console.log("createMultisig");

            // check fields filled
            if( $scope.name == '' || $scope.txLifeTime <= 0 || $scope.keys.indexOf('') == 0 || $scope.minSig < 2 || $scope.minSig > $scope.keys.length) {

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
                        }
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
                    });

            }
        }

        $scope.createMultisigModal = () => {
            $http.get ('/api/mnemonic')
                .then ((data) => {
                    console.log("createMultisigModal");
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
            $scope.modalInstance = $uibModal.open({
                templateUrl: '/public/main/views/modals/makeTxModal.html',
                controller: 'MainController',
                backdrop: 'static'
            })
        }

        $scope.addMultisigModal = () => {
            console.log("makeTxModal");
            $scope.modalInstance = $uibModal.open({
                templateUrl: '/public/main/views/modals/addMultisigModal.html',
                controller: 'MainController',
                backdrop: 'static'
            })
        }

        $scope.addPublicKey = () => {
            $scope.keys.push('');
        }

    }]);