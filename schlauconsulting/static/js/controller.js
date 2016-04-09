var DWAApp = angular.module('DWAApp', []);

DWAApp.controller('AppName', function ($scope)
{
    $scope.prog_name = 'Werbemittel'
    $scope.quantity = 5

    $scope.reset = function() {
        $scope.quantity = angular.copy($scope.quantity);
    };
    $scope.reset();
});