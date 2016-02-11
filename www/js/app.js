// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
//cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-inappbrowser.git
//cordova plugin add net.yoik.cordova.plugins.screenorientation
//cordova plugin add cordova-plugin-network-information

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });

})

.directive("navigateTo",function($ionicGesture) {
	return {
	  restrict: 'A',
	  link:function ($scope,$element,$attr) {
		var tapHandler = function(e) {
		  var inAppBrowser = window.open(encodeURI($attr.navigateTo),'_blank','location=yes','toolbar=yes');
		};
		var tapGesture = $ionicGesture.on('tap',tapHandler,$element);
		$scope.$on('$destroy', function() {
		  $ionicGesture.off(tapGesture,'tap',tapHandler);
		});
	  }
	}
})

.directive('onlyNum', function() {
        return function(scope, element, attrs) {

            var keyCode = [8,9,37,39,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,110];
            element.bind("keydown", function(event) {
                console.log($.inArray(event.which,keyCode));
                if($.inArray(event.which,keyCode) == -1) {
                    scope.$apply(function(){
                        scope.$eval(attrs.onlyNum);
                        event.preventDefault();
                    });
                    event.preventDefault();
                }

            });
        };
    })

.directive('formatar', function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel){
           /* ngModel.$formatters.push(function(value){
                //formats the value for display when ng-model is changed
                return '150'; 
            });*/
            ngModel.$parsers.push(function(value){
                //formats the value for ng-model when input value is changed
				var numbers = value.replace(/\D/g, '') ; //somente numero
				element.val(numbers) ; //somente numero
				//value.toUpperCase();
				return numbers ;
            });
        }
    };
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
	// Tela de login
    .state('login', {
		url: '/login',
		templateUrl: 'templates/login.html',
		controller: 'loginCtrl'
	})

    .state('cadastrar', {
		url: '/cadastrar',
        templateUrl: 'templates/cadastrar.html',
        controller: 'cadastrarCtrl'
    })
			
    // setup an abstract state for the tabs directive
        .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
		//controller: 'principalCtrl'
    })

    // Each tab has its own nav history stack:

    .state('tab.principal', {
        url: '/principal',
        views: {
            'tab-principal': {
                templateUrl: 'templates/tab-principal.html',
                controller: 'principalCtrl'
            }
        }
    })

    .state('tab.veiculos', {
        url: '/veiculos',
        views: {
            'tab-principal': {
                templateUrl: 'templates/veiculos.html',
                controller: 'veiculosCtrl'
            }
        }
    })
	
	.state('tab.editVeiculo', {
        url: '/editVeiculo/:id',
        views: {
            'tab-principal': {
                templateUrl: 'templates/editVeiculo.html',
                controller: 'editVeiculoCtrl'
            }
        }
    })

	.state('tab.editAgendamento', {
        url: '/editAgendamento/:id',
        views: {
            'tab-principal': {
                templateUrl: 'templates/editAgendamento.html',
                controller: 'editAgendamentoCtrl'
            }
        }
    })
	
    .state('tab.agendamento', {
        url: '/agendamento',
        views: {
            'tab-principal': {
                templateUrl: 'templates/agendamento.html',
                controller: 'agendamentoCtrl'
            }
        }
    })

    .state('tab.funilaria', {
        url: '/funilaria',
        views: {
            'tab-principal': {
                templateUrl: 'templates/funilaria.html',
                controller: 'funilariaCtrl'
            }
        }
    })
	
	.state('tab.testdrive', {
        url: '/testdrive',
        views: {
            'tab-principal': {
                templateUrl: 'templates/testdrive.html',
                controller: 'testdriveCtrl'
            }
        }
    })
	
	.state('tab.jornal', {
        url: '/jornal',
        views: {
            'tab-principal': {
                templateUrl: 'templates/jornal.html',
                controller: 'jornalCtrl'
            }
        }
    })
	
	.state('tab.carrosnovos', {
                url: '/carrosnovos',
                views: {
                    'tab-principal': {
                        templateUrl: 'templates/carrosnovos.html',
                        controller: 'carrosNovosCtrl'
                    }
                }
    })

    .state('tab.avaliacao', {
        url: '/avaliacao/:id',
        views: {
            'tab-principal': {
                templateUrl: 'templates/avaliacao.html',
                controller: 'avaliacaoCtrl'
            }
        }
    })

    .state('tab.seguro', {
        url: '/seguro',
        views: {
            'tab-principal': {
                templateUrl: 'templates/seguro.html',
                controller: 'seguroCtrl'
            }
        }
    })

    .state('tab.lojas', {
        url: '/lojas',
        views: {
            'tab-principal': {
                templateUrl: 'templates/lojas.html',
                controller: 'lojasCtrl'
            }
        }
    })

    .state('tab.contato', {
        url: '/contato',
        views: {
            'tab-principal': {
                templateUrl: 'templates/contato.html',
                controller: 'contatoCtrl'
            }
        }
    })

    .state('tab.perfil', {
        url: '/perfil',
        views: {
            'tab-perfil': {
                templateUrl: 'templates/tab-perfil.html',
                controller: 'perfilCtrl'
            }
        }
    })

	.state('tab.img', {
        url: '/img/:id',
        views: {
            'tab-alert': {
                templateUrl: 'templates/tab-img-alert.html',
                controller: 'alertImgCtrl'
            }
        }
    })
	
	.state('tab.txt', {
        url: '/txt/:id',
        views: {
            'tab-alert': {
                templateUrl: 'templates/tab-txt-alert.html',
                controller: 'alertTxtCtrl'
            }
        }
    })
	
    .state('tab.alert', {
        url: '/alert',
        views: {
            'tab-alert': {
                templateUrl: 'templates/tab-alert.html',
                controller: 'alertCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('login');

});
