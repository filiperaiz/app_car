// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
//cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-inappbrowser.git

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
		controller: 'principalCtrl'
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
        url: '/avaliacao',
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
