/**
 * Created by andreafspeziale on 03/02/17.
 */
/**
 * Created by andreafspeziale on 25/01/17.
 */
configuration.config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) => {
    $routeProvider.when('/', {
        templateUrl: '/public/config/views/config.html'
    }).otherwise({
        redirectTo: '/'
    });
    // $routeProvider.when('/node', {
    //     templateUrl: '/public/config/views/config.html'
    // }).otherwise({
    //     redirectTo: '/'
    // });
    // $routeProvider.when('/wallet', {
    //     templateUrl: '/public/config/views/config.html'
    // }).otherwise({
    //     redirectTo: '/'
    // });
}])