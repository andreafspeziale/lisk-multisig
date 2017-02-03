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

                $http.post('/api/node', params)
                    .then((data) => {
                        $location.path(data.data.redirect);
                    })
                    .catch((err) => {
                        $location.path("/");
                    });

            } else {
                toastr.warning('Fill all the fields', 'Warning');
            }
        }

    }])