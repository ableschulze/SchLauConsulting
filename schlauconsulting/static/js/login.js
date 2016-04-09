var myappLogin = angular.module('GWVerwaltungAppLogin', []);

myappLogin.controller('LoginCtrl', function($scope,$http)
{
    $scope.LoginClick = function Login()
    {
        dataLog =
        {
            Email: $scope.txtRegEmail,
            Anrede: $scope.txtRegAnrede,
            Vorname: $scope.txtRegVorname,
            Gebdatum: $scope.txtRegGebdatum,
            Name: $scope.txtRegName,
            Strasse: $scope.txtRegStrasse,
            PLZ: $scope.txtRegPlz,
            Ort: $scope.txtRegOrt,
            PW: $scope.txtRegPW,
            PWRep: $scope.txtRegPWReg
        }

        $http({
        url     : 'register',
        method: "POST",
        data: dataLog
        }).then(
        function successCallback(response)
        {
            alert(response.data["message"])
        }
        ,
        function errorCallback(response)
        {
            alert(response.data)
        });
    }

    $http({
    url     : 'anrede',
    method: "POST"
    }).then(
    function successCallback(response)
    {
        $scope.anreden = response.data
    },
    function errorCallback(response)
    {
        alert(response.data)
    });
});