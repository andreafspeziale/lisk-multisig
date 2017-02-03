/**
 * Created by andreafspeziale on 03/02/17.
 */
main.config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) => {
    $routeProvider.when('/main', {
        templateUrl: '/public/main/views/main.html'
    }).otherwise({
        redirectTo: '/'
    });
}])