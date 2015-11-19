angular.module('starter.controllers', [])

.controller('principalCtrl', function($scope) {})

.controller('veiculosCtrl', function($scope, $ionicModal) {

    $ionicModal.fromTemplateUrl('templates/modal-addcar.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
})

.controller('agendamentoCtrl', function($scope,  $ionicModal) {
    $ionicModal.fromTemplateUrl('templates/modal-addagendamento.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
})

.controller('funilariaCtrl', function($scope) {

})

.controller('avaliacaoCtrl', function($scope) {

})

.controller('seguroCtrl', function($scope) {

})

.controller('lojasCtrl', function($scope) {

})

.controller('contatoCtrl', function($scope) {

})

.controller('perfilCtrl', function($scope,  $ionicModal) {
    $ionicModal.fromTemplateUrl('templates/modal-editperfil.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
})






.controller('alertCtrl', function($scope) {

});
