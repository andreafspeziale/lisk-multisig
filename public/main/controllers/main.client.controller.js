/**
 * Created by andreafspeziale on 03/02/17.
 */
main.controller('MainController', ['$scope', '$http', '$location', '$rootScope', 'toastr', '$uibModal',
    ($scope, $http, $location, $rootScope, toastr, $uibModal) => {

        $scope.publicKeys = [''];

        $scope.createMultisigModal = () => {
            console.log("createMultisigModal");
            $scope.modalInstance = $uibModal.open({
                templateUrl: '/public/main/views/modals/createMultisigModal.html',
                controller: 'MainController',
                backdrop: 'static'
            })
        }

        // toDo add dismiss modal

        $scope.addPublicKey = () => {
            $scope.publicKeys.push('');
        }

    }]);