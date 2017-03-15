/**
 * Created by andreafspeziale on 25/01/17.
 */
wallet.controller('WalletController', ['$scope', '$http', '$location', '$rootScope', 'toastr',
    ($scope, $http, $location, $rootScope, toastr) => {

        $scope.name = '';
        $scope.yourAddress = '';
        $scope.yourSecret = '';
        $scope.yourSecondSecret = '';

        $scope.saveWallet = () => {
            if( !($scope.yourAddress == '' && $scope.yourSecret == '' && $scope.name == '')) {

                let wallet = {
                    "address":$scope.yourAddress,
                    "secret":$scope.yourSecret,
                    "secondSecret":$scope.yourSecondSecret,
                    "name":$scope.name
                };

                // valid values

                $http.post('/api/wallet', wallet)
                    .then((data) => {
                        console.log("Configuration completed go to main functions");
                        if(data.data.type == 'error')
                            toastr.error(data.data.message, 'Error');
                        else
                            toastr.success(data.data.message, 'Success');
                        $location.path(data.data.redirect);
                    })
                    .catch((err) => {
                        console.log("Some error occur saving your wallet infos");
                        $location.path("/");
                    });

            } else {
                console.log('Fill the fields');
                toastr.warning('Fill all the fields', 'Warning');
            }
        }

    }])