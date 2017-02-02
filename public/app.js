/**
 * Created by andreafspeziale on 25/01/17.
 */
const mainApplicationModuleName = 'liskMmultisig';
const mainApplicationModule = angular.module(mainApplicationModuleName, ['ngRoute', 'node', 'wallet']);

mainApplicationModule.config(['$locationProvider', ($locationProvider) => {
    $locationProvider.hashPrefix('!');
}]);

