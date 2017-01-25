/**
 * Created by andreafspeziale on 25/01/17.
 */
const mainApplicationModuleName = 'liskMmultisig';
const mainApplicationModule = angular.module(mainApplicationModuleName, ['ngRoute', 'node']);

mainApplicationModule.config(['$locationProvider', ($locationProvider) => {
    $locationProvider.hashPrefix('!');
}]);

