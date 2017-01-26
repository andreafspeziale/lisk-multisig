/**
 * Created by andreafspeziale on 25/01/17.
 */
node.controller('NodeController', ['$scope', '$rootScope', 'toastr',
    ($scope, $rootScope, toastr) => {
        $scope.nodeIp = '';
        $scope.nodePort = 8000;
        /*
            toDo | Check if data json already exists or not

                true --> go to proper route
                false --> go on with checks

            toDo | Get node form input

            toDo | check if node is reachable, and start creating a configuration json that will contain the configuration data.
            {
                node: {
                    ip: 'ip',
                    port: port
                }
            }

            toDo | write the data and go to the next step/route
        */

        $scope.saveNode = () => {
            if( !($scope.nodeIp == '' || $scope.nodePort == '' )) {

                // valid values initialize the lib

                const params = {
                    host: $scope.nodeIp,
                    port: $scope.nodePort,
                    ssl: true
                }

                console.log(params);
                // $rootScope.lisk = require('liskapi')();
            } else {
                console.log('Fill the fields');
                toastr.warning('Fill all the fields', 'Warning');
            }
        }

    }])