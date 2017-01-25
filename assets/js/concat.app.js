/**
 * Created by andreafspeziale on 25/01/17.
 */
const mainApplicationModuleName = 'liskMmultisig';
const mainApplicationModule = angular.module(mainApplicationModuleName, ['ngRoute', 'node']);

mainApplicationModule.config(['$locationProvider', ($locationProvider) => {
    $locationProvider.hashPrefix('!');
}]);

/**
 * Created by andreafspeziale on 25/01/17.
 */
const node = angular.module('node', []);/**
 * Created by andreafspeziale on 25/01/17.
 */
node.config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) => {
    $routeProvider.when('/', {
        templateUrl: '/public/node/views/node.html'
    }).otherwise({
        redirectTo: '/'
    });
    // use the HTML5 History API
    $locationProvider.html5Mode(true);
}])/**
 * Created by andreafspeziale on 25/01/17.
 */
node.controller('NodeController', ['$scope',
    ($scope) => {


    }])