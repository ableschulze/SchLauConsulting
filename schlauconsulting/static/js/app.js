var myapp = angular.module('KOM', []);
var urlServer = 'http://localhost:6543/'

myapp.controller('ngKOMApps', function($scope)
{
    $scope.clickAnwesenheitskontrolle = function(){ clickAnwesenheitskontrolle($scope) }
    $scope.clickMesseFoerderpreise = function(){ clickMesseFoerderpreise($scope) }
    $scope.clickDatenerfassungFerchauAktuell = function(){ clickDatenerfassungFerchauAktuell($scope) }
})

function clickAnwesenheitskontrolle($scope)
{
    console.log('anwesenheit')
    $scope.main = '/static/sites/Anwesenheitskontrolle.html'
}

function clickMesseFoerderpreise($scope)
{
    console.log('messe')
    $scope.main = '/static/sites/MesseUndFoerderpreise.html'
}

function clickDatenerfassungFerchauAktuell($scope)
{
    console.log('messe')
    $scope.main = '/static/sites/DatenerfassungFerchauAktuell.html'
}


