/**
 * Created by andreafspeziale on 03/02/17.
 */
main.controller('MainController', ['$scope', '$http', '$location', '$rootScope', 'toastr', '$uibModal',
    ($scope, $http, $location, $rootScope, toastr, $uibModal) => {

        $scope.publicKeys = [''];
        $scope.txLifeTime = '';

        $scope.createMultisig = () => {
            console.log("createMultisig");

            // check fields filled
            if( $scope.txLifeTime == '' || $scope.publicKeys.indexOf('') == 0) {

                toastr.warning('Fill all the fields', 'Warning');

            } else {

                // toDo creation api call
                let params = {
                    "secret":$scope.mnemonic,
                    "lifetime":$scope.txLifeTime,
                    "publicKeys":$scope.publicKeys
                };

                $http.post('/api/multisig', params)
                    .then((data) => {
                        // response
                    })
                    .catch((err) => {
                        // error
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
            $scope.modalInstance = $uibModal.open({
                templateUrl: '/public/main/views/modals/signMultisigTxModal.html',
                controller: 'MainController',
                backdrop: 'static'
            })
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
            $scope.publicKeys.push('');
        }

    }]);