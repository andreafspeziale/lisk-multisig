/**
 * Created by andreafspeziale on 03/02/17.
 */
main.controller('MainController', ['$scope', '$http', '$location', '$rootScope', 'toastr', '$uibModal',
    ($scope, $http, $location, $rootScope, toastr, $uibModal) => {

        $scope.publicKeys = [''];

        // toDo check fields filled

        $scope.createMultisig = () => {
            console.log("createMultisig");
            if( !($scope.txLifeTime == '' || $scope.nodePort == '' )) {

            } else {
                toastr.warning('Fill all the fields', 'Warning');
            }
        }

        $scope.createMultisigModal = () => {
            console.log("createMultisigModal");
            $scope.modalInstance = $uibModal.open({
                templateUrl: '/public/main/views/modals/createMultisigModal.html',
                controller: 'MainController',
                backdrop: 'static'
            })
        };

        $scope.signMultisigTxModal = () => {
            console.log("signMultisigTxModal");
            $scope.modalInstance = $uibModal.open({
                templateUrl: '/public/main/views/modals/signMultisigTxModal.html',
                controller: 'MainController',
                backdrop: 'static'
            })
        }

        // toDo add dismiss modal

        $scope.addPublicKey = () => {
            $scope.publicKeys.push('');
        }

    }]);