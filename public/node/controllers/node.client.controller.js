/**
 * Created by andreafspeziale on 25/01/17.
 */
node.controller('NodeController', ['$scope', '$http', '$location', '$rootScope', 'toastr',
    ($scope, $http, $location, $rootScope, toastr) => {
        $scope.nodeIp = '';
        $scope.nodePort = 8000;
        $scope.ssl = true;

        // toDo this controller/page should be fired if the node has never been setted up

        $scope.saveNode = () => {
            if( !($scope.nodeIp == '' || $scope.nodePort == '' )) {

                // valid values initialize the lib

                let params = {
                    host: $scope.nodeIp,
                    port: $scope.nodePort,
                    ssl: $scope.ssl
                };

                console.log($scope.checked);

                $http.post('/api/config', params)
                    .then(function (data, status, headers, config) {
                        console.log('success');
                    })
                    .catch(function (data, status, header, config) {
                        console.log('error', data);
                        console.log('error', status);

                    });

            } else {
                console.log('Fill the fields');
                toastr.warning('Fill all the fields', 'Warning');
            }
        }

    }])