/**
 * Created by andreafspeziale on 03/02/17.
 */
main.controller('MainController', ['$scope', '$http', '$location', '$rootScope', 'toastr', '$uibModal',
    ($scope, $http, $location, $rootScope, toastr, $uibModal) => {

        $scope.publicKeys = [''];

        $scope.createMultisig = () => {
            console.log("createMultisig");
            // check fields filled
            if( !($scope.txLifeTime == '' || ($scope.publicKeys.length && $scope.publicKeys[0] == '') )) {

                // call api that create the multisignature account



            } else {
                toastr.warning('Fill all the fields', 'Warning');
            }
        }

        $scope.createMultisigModal = () => {
            $http.get ('/api/mnemonic')
                .then ((data) => {
                    console.log("createMultisigModal");
                    $scope.mnemonic = data.data.secret;
                    console.log($scope.mnemonic);

                    // toDo print mnemonic psw in the modal

                    $scope.modalInstance = $uibModal.open({
                        templateUrl: '/public/main/views/modals/createMultisigModal.html',
                        controller: 'MainController',
                        backdrop: 'static'
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

        $scope.addPublicKey = (key, index) => {

            // toDo manage public key array

            console.log(key);
            console.log(index);
        }

    }]);