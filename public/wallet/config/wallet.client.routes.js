/**
 * Created by andreafspeziale on 25/01/17.
 */
wallet.config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) => {
    $routeProvider.when('/wallet', {
        templateUrl: '/public/wallet/views/wallet.html'
    }).otherwise({
        redirectTo: '/'
    });
    // use the HTML5 History API
    $locationProvider.html5Mode(true);
}])