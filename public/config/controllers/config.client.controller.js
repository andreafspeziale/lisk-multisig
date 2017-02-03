/**
 * Created by andreafspeziale on 03/02/17.
 */
configuration.controller('ConfigController', ['$scope', '$http', '$location', '$rootScope', 'toastr',
    ($scope, $http, $location, $rootScope, toastr) => {

        console.log("ConfigController fired");

        $http.get ('/api/config')
            .then ((data) => {
                console.log("ok ", data);
                $location.path(data.data.redirect);
            })
            .catch((err) => {
                console.log("error ", err);
                $location.path(data.data.redirect);
            });

    }])