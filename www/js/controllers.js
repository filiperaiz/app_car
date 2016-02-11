angular.module('starter.controllers', ['ionic','ngCordova'])

.controller('loginCtrl', function($scope, $http, $location, $localstorage, $cordovaDialogs, $ionicModal, $window, webDados) {
	var id_user = $localstorage.get('user');

	if(id_user!=0){$location.url('/tab/principal');}
	$scope.login = {};
	$scope.getLogin = function(){
		webDados.getLogin($scope.login.email,$scope.login.senha).then(function(dado){
			if(isNaN(parseInt(dado, 10))){var login = dado;}else{var login = 0;};
			if(login!=0){
				$localstorage.set('user', dado[0].id);
				$localstorage.set('email', dado[0].email);
				if(dado[0].id==0 || dado[0].id=='undefined'){
					$location.url('/login');$cordovaDialogs.alert("Login inválido!","Mensagem");
				}else{
					$location.url('/tab/principal');
				}
			}else{
				$location.url('/login');$cordovaDialogs.alert("Login inválido!","Mensagem");
			}
		});
	};
	$scope.recuperar = [];
	$scope.recuperarLogin = function(){
		console.log('teste:'+$scope.recuperar.email);
			var link = 'http://www.alemanhafichas.com.br/app_alemanha/recuperarLogin.php';
			$http.post(link, {'email': $scope.recuperar.email})
			.success(function (recuperar,status,headers,config){
				console.log('retorno:'+recuperar);
			});
	};
	
	$scope.$on('$ionicView.enter',function(){ 
		console.log('tela login');
		if(typeof $localstorage.get('user') === 'undefined' || $localstorage.get('user')==0){
			console.log('sair login');
		}
	});
	
	$ionicModal.fromTemplateUrl('templates/modal-esquecisenha.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});
})

.controller('cadastrarCtrl', function($scope, $http, $ionicModal, $localstorage, $cordovaDialogs, $cordovaToast, $location, webDados) {
	$localstorage.set('user', 0);
	$scope.cliente = {};
	$scope.insCliente = function(){
		var link = 'http://www.alemanhafichas.com.br/app_alemanha/insCliente.php';
			$http.post(link, {'nome': $scope.cliente.nome,'email': $scope.cliente.email,'senha': $scope.cliente.senha,'celular': $scope.cliente.celular})
			.success(function (cliente,status,headers,config){
				var id_user = parseInt(cliente, 10);
				$location.url('/tab/principal');
				if(isNaN(parseInt(dado, 10))){
					$localstorage.set('user', 0);
				}else{
					$localstorage.set('user', parseInt(cliente, 10));
				}
				$localstorage.set('email', $scope.cliente.email);
			});
	};
})

.controller('principalCtrl', function($scope, $rootScope, $timeout, $cordovaPush, $location, $localstorage, $window, $cordovaDialogs, $cordovaMedia, $cordovaToast, $http, $cordovaDevice) {
	console.log('principal');
	
	var currentPlatform = ionic.Platform.platform();
	var id_user = $localstorage.get('user');
	
	//sempre verificar o codigo do usuario existe
	$scope.$on('$ionicView.enter',function(){ 
		console.log("user");
		console.log($localstorage.get('user'));
		if($localstorage.get('user') == 'undefined' || $localstorage.get('user')==0 || $localstorage.get('user')==''){
			console.log('logar novamente');
			$location.url('/login');
		}
	});
	
	if(id_user == null){id_user=0;$location.url('/login');}
	if(id_user==0){$location.url('/login');}
	
	console.log('user principal:'+id_user);
	//$scope.alertaShow =  false;
	
	$scope.getQntAlertas = function(){
		console.log('alerta');
		$http.get("http://alemanhafichas.com.br/app_alemanha/getQntAlertas.php?id="+id_user)
		.success(function (response) {
			if (response!=0){
				$scope.quant_alerta = response;
				$rootScope.quant_alerta = response;
				//$scope.alertaShow=true;
				$rootScope.alertaShow = true;
			}else{
				$scope.quant_alerta = 0;
				$rootScope.quant_alerta = 0;
				//$scope.alertaShow=false;
				$rootScope.alertaShow = false;
			}
		})
		
	}
	console.log("rootScope");
	console.log($rootScope.quant_alerta);
	$scope.getQntAlertas();
	
	$scope.notifications = [];
    
    $scope.register = function(){
        
		var config = null;
        if (ionic.Platform.isAndroid()) {
            config = {
                "senderID": "492988470624"
            };
        }
        else if (ionic.Platform.isIOS()) {
            config = {
                "badge": "true",
                "sound": "true",
                "alert": "true"
            }
        }
		
		if(currentPlatform!='win32'){
			
			$cordovaPush.register(config).then(function (result,data) {
				$scope.token = data;
			   // $cordovaToast.showShortCenter('Registered for push notifications');
				$scope.registerDisabled=true;
				// ** NOTE: Android regid result comes back in the pushNotificationReceived, only iOS returned here
				if (ionic.Platform.isIOS()) {
					$scope.regId = result;
					$scope.token = result;
					storeDeviceToken("ios");
				}
			}, function (err) {
				console.log("Register error " + err)
			});
			
		}
    }

	ionic.Platform.ready(function(){
		$scope.register();
	});
	//sempre executar no controller
	$scope.$on('ionic.Platform.ready',function(){ 
		console.log('registro1');	
	});
	
    // Notification Received
    $scope.$on('$cordovaPush:notificationReceived', function (event, notification) {
		console.log("notificacao:"+JSON.stringify([notification]));
        if (ionic.Platform.isAndroid()) {
			$scope.token = notification;
			$scope.key = notification.regid; 
			//post cliente
			$scope.altToken = function(){
				var id_user = $localstorage.get('user');
				var link = 'http://www.alemanhafichas.com.br/app_alemanha/altToken.php';
				$http.post(link, {'id': id_user,'token': $scope.key})
				.success(function (token,status,headers,config){
					//console.log('retorno:'+token);
				});
			};
			$scope.altToken();
            handleAndroid(notification);
        } else if (ionic.Platform.isIOS()) {
			$scope.token = notification;
            handleIOS(notification);
            $scope.$apply(function () {
                $scope.notifications.push(JSON.stringify(notification.alert));
            })
        }
    });
	
	// Android Notification Received Handler --  14800 des - 180 li bros 0c -42xx --
    function handleAndroid(notification) {
        // ** NOTE: ** You could add code for when app is in foreground or not, or coming from coldstart here too
        //             via the console fields as shown.
        console.log("In foreground " + notification.foreground  + " Coldstart " + notification.coldstart);
        if (notification.event == "registered") {
            $scope.regId = notification.regid;	
            storeDeviceToken("android");
        } else if (notification.event == "message") {
            //$cordovaDialogs.alert(notification.message, "Push Notification Received");
			$scope.getAlertas();
			$location.url('/tab/alert');
			$window.location.reload();	
			$scope.$apply(function () {
                $scope.notifications.push(JSON.stringify(notification.message));
            })
        } else if (notification.event == "error")
            $cordovaDialogs.alert(notification.msg, "Push notification error event");
        else $cordovaDialogs.alert(notification.event, "Push notification handler - Unprocessed Event");
    }

    // IOS Notification Received Handler
    function handleIOS(notification) {
        // The app was already open but we'll still show the alert and sound the tone received this way. If you didn't check
        // for foreground here it would make a sound twice, once when received in background and upon opening it from clicking
        // the notification when this code runs (weird).
        if (notification.foreground == "1") {
            // Play custom audio if a sound specified.
            if (notification.sound) {
                var mediaSrc = $cordovaMedia.newMedia(notification.sound);
                mediaSrc.promise.then($cordovaMedia.play(mediaSrc.media));
            }

            if (notification.body && notification.messageFrom) {
                $cordovaDialogs.alert(notification.body, notification.messageFrom);
            }
            else $cordovaDialogs.alert(notification.alert, "Push Notification Received");

            if (notification.badge) {
                $cordovaPush.setBadgeNumber(notification.badge).then(function (result) {
                    console.log("Set badge success " + result)
                }, function (err) {
                    console.log("Set badge error " + err)
                });
            }
        }
        // Otherwise it was received in the background and reopened from the push notification. Badge is automatically cleared
        // in this case. You probably wouldn't be displaying anything at this point, this is here to show that you can process
        // the data in this situation.
        else {
            if (notification.body && notification.messageFrom) {
                $cordovaDialogs.alert(notification.body, "(RECEIVED WHEN APP IN BACKGROUND) " + notification.messageFrom);
            }
            else $cordovaDialogs.alert(notification.alert, "(RECEIVED WHEN APP IN BACKGROUND) Push Notification Received");
        }
    }
	
})

.controller('veiculosCtrl', function($scope, $http, $stateParams, $ionicModal, $cordovaToast, $location,$ionicLoading,  $window, $ionicHistory, $cordovaDialogs, $localstorage, webDados, $rootScope, $state) {
	$scope.loading = $ionicLoading.show({content: 'carregando...',showBackdrop: false});
	var id_user = $localstorage.get('user');
	console.log('veiculos');	 
	$scope.veiculos = [];
	$scope.getVeiculos = function(){
		webDados.getVeiculos("getVeiculo.php?id="+id_user).then(function(dados){
			$scope.veiculos = dados;
			$rootScope.veiculos = dados;
			$ionicLoading.hide();
			if($scope.veiculos==0){$scope.modal.show();}
		}).catch(function(erro){
			console.log(erro);
			if(erro.status==0){
				$ionicLoading.hide();
				$cordovaDialogs.alert("Falha na conexão de dados","Mensagem");
			}
		});
	}
	
	if(typeof $rootScope.veiculos === 'undefined' || $rootScope.veiculos.length==0){
		$scope.getVeiculos();
		console.log('get');
	}else{
		$scope.veiculos = $rootScope.veiculos;
		$ionicLoading.hide();
		console.log('igual');
	}
			
	webDados.getModelos("getModelos.php?id=4").then(function(dados){$scope.modelos = dados;});
	$scope.veiculo = [];
	$scope.buscaDados = function(){
		if($scope.veiculo.placa!=''){
				console.log('placa');
		}
	}
	$scope.insVeiculo = function(){
		$scope.veiculo.id = id_user;
		console.log($scope.veiculo);
		
		$ionicLoading.show();
		webDados.setVeiculo("insVeiculo.php",id_user,$scope.veiculo).then(function(dados){
			if (dados.data!=0){
				$scope.getVeiculos();
				$scope.modal.hide();
				$location.url('/tab/veiculos');
				$scope.veiculos.$apply;
				//$window.location.reload();				
			}else{
				$ionicLoading.hide();
				$cordovaDialogs.alert("veículo já cadastrado","Mensagem");
			}
		}).catch(function(erro){
			console.log(erro);
			if(erro.status==0){
				$ionicLoading.hide();
				$cordovaDialogs.alert("Falha na conexão de dados","Mensagem");
			}
		});
		
	};
	$scope.$on('$ionicView.enter',function(){ 
		$scope.veiculos = $rootScope.veiculos;	
	});
	
    $ionicModal.fromTemplateUrl('templates/modal-addcar.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
})

.controller('editVeiculoCtrl', function($scope,$window,$state, $localstorage, $stateParams, $ionicLoading, $http, $ionicModal, $location, $cordovaDialogs, webDados, $rootScope, $state) {
	var id_user = $localstorage.get('user');
	$scope.loading = $ionicLoading.show({content: 'carregando...',showBackdrop: false});
	webDados.getModelos("getModelos.php?id=4").then(function(dados){$scope.modelos = dados;});
	var id_veiculo = $stateParams.id;
	console.log(id_veiculo);
			
	$scope.veiculo = [];
	$scope.getVeiculo = function(){
		$http.get("http://alemanhafichas.com.br/app_alemanha/getVeiculoCliente.php?id="+id_veiculo)
		.success(function (response) {	
			$scope.veiculo = response[0];
			//$scope.veiculo.id_modelo_veiculo  = $scope.veiculo.id_veiculo_app;
			$ionicLoading.hide();		
		}).catch(function(erro){
			console.log(erro);
			if(erro.status==0){
				$ionicLoading.hide();
				$cordovaDialogs.alert("Falha na conexão de dados","Mensagem");
			}
		});
	}
	$scope.getVeiculo();
	
	
	$scope.getVeiculos = function(){
		webDados.getVeiculos("getVeiculo.php?id="+id_user).then(function(dados){
			$scope.veiculos = dados;
			$rootScope.veiculos = dados;
			$ionicLoading.hide();
			if($scope.veiculos==0){$scope.modal.show();}
		}).catch(function(erro){
			console.log(erro);
			if(erro.status==0){
				$ionicLoading.hide();
				$cordovaDialogs.alert("Falha na conexão de dados","Mensagem");
			}
		});
		
	}
	
	
	
	$scope.delVeiculo = function(){
		$cordovaDialogs.confirm('Excluir o veículo de placa: '+$scope.veiculo.placa+' ?', 'Confirme', ['Sim','Não'])
		.then(function(buttonIndex) {
		  // no button = 0, 'OK' = 1, 'Cancel' = 2
		  var btnIndex = buttonIndex;
			if(buttonIndex==1){
				$ionicLoading.show();
				$http.get("http://alemanhafichas.com.br/app_alemanha/delVeiculo.php?id="+id_veiculo)
				.success(function (response) {
					if(response==1){$cordovaDialogs.alert("Não foi possível excluir pois existe agendamento para este veículo!","Alerta");$ionicLoading.hide();}else{$scope.getVeiculos();
					
					$location.url('/tab/veiculos');

					}
				}).catch(function(erro){
					console.log(erro);
					if(erro.status==0){
						$ionicLoading.hide();
						$cordovaDialogs.alert("Falha na conexão de dados de dados","Mensagem");
					}
				});
			}
		});
	}

	$scope.altVeiculo = function(){
			//$ionicLoading.show();
			
			var link = 'http://www.alemanhafichas.com.br/app_alemanha/altVeiculo.php';
			$http.post(link, {'id': $scope.veiculo.id_veiculo_app,'placa': $scope.veiculo.placa,'ano_fabricacao': $scope.veiculo.ano_fabricacao,'ano_modelo': $scope.veiculo.ano_modelo})
			.success(function (carro,status,headers,config){
				console.log('retorno:'+carro.modelo);
				
				//----------
				webDados.getVeiculos("getVeiculo.php?id="+id_user).then(function(dados){$scope.veiculos = dados;
				//console.log($scope.veiculos);
				
				$location.url('/tab/veiculos');
				$window.location.reload();
				//$state.reload();
				//$state.go('tab.veiculos', {}, { reload: true });
				});
				
				//------
				//angular.element(document.getElementById('yourControllerElementID')).scope().get();
			});
	}
})

.controller('agendamentoCtrl', function($scope, $http, $ionicModal, $ionicLoading, $location, $localstorage, webDados, $rootScope, $cordovaDialogs) {
	$scope.loading = $ionicLoading.show({content: 'carregando...',showBackdrop: false});
	var id_user = $localstorage.get('user');
	console.log('agendamento');
	console.log(id_user);
	if(id_user==0){$location.url('/tab/login');}
	$scope.car = [];
	if(typeof $rootScope.veiculos === 'undefined' || $rootScope.veiculos.length==0){
		webDados.getVeiculos("getVeiculo.php?id="+id_user).then(function(dados){
			$scope.veiculos = dados;
			$rootScope.veiculos = dados;
			$scope.car = $scope.veiculos; 
			if($scope.veiculos==0){
				$scope.modal.hide();
				$location.url('/tab/veiculos');
			}
		}).catch(function(erro){
			console.log(erro);
			if(erro.status==0){
				$ionicLoading.hide();
				$cordovaDialogs.alert("Falha na conexão de dados","Mensagem");
			}
		});
		console.log('get');
	}else{
		$scope.veiculos = $rootScope.veiculos;
		console.log('igual');
	}
	webDados.getServicos("getServicos.php?id=4").then(function(dados){
		$scope.servicos = dados;
	});
	webDados.getLojas("getLojasOficina.php?id=4").then(function(dados){$scope.lojas = dados;});
	$scope.getAgendamento = function(){
		$http.get("http://alemanhafichas.com.br/app_alemanha/getAgendamento.php?id="+id_user)
		.success(function (response) {	
			$scope.agendamentos = response;		
			console.log($scope.agendamentos);
			$ionicLoading.hide();
			if($scope.agendamentos==0 && $scope.car!=0){$scope.modal.show();}	
		}).catch(function(erro){
			console.log(erro);
			if(erro.status==0){
				$ionicLoading.hide();
				$cordovaDialogs.alert("Falha na conexão de dados","Mensagem");
			}
		});
	}
	$scope.getAgendamento();
	$scope.agendar = [];
	$scope.insAgendamento = function(){
			console.log($scope.agendar.veiculo);	
			var link = 'http://www.alemanhafichas.com.br/app_alemanha/insAgendamento.php';
			$http.post(link, {'id': id_user,'codigo': $scope.agendar.veiculo,'km_atual': $scope.agendar.km_atual,'servico': $scope.agendar.servico,'loja': $scope.agendar.loja,'dia': $scope.agendar.dia,'hora': $scope.agendar.hora,'observacoes': $scope.agendar.observacoes})
			.success(function (agendamento,status,headers,config){
				console.log('retorno:'+agendamento);
				$scope.getAgendamento();
				$scope.modal.hide();
			});
	};
	
	$ionicModal.fromTemplateUrl('templates/modal-addagendamento.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
	
})

.controller('funilariaCtrl', function($scope, $rootScope, $http, $cordovaDialogs, $location, $localstorage, $ionicLoading, webDados) {
	
	$scope.loading = $ionicLoading.show({content: 'carregando...',showBackdrop: false});
	var id_user = $localstorage.get('user');
	if(typeof $rootScope.veiculos === 'undefined' || $rootScope.veiculos.length==0){
		webDados.getVeiculos("getVeiculo.php?id="+id_user).then(function(dados){
			$scope.veiculos = dados;
			$rootScope.veiculos = dados;
			if($scope.veiculos==0){$location.url('/tab/veiculos');}
			$ionicLoading.hide();
		}).catch(function(erro){
			console.log(erro);
			if(erro.status==0){
				$ionicLoading.hide();
				$cordovaDialogs.alert("Falha na conexão de dados","Mensagem");
			}
		});
		console.log('get');
	}else{
		$scope.veiculos = $rootScope.veiculos;
		$ionicLoading.hide();
		console.log('igual');
	}
	$scope.funilaria = [];
	$scope.insFunilaria = function(){
			console.log($scope.funilaria);	
			var link = 'http://www.alemanhafichas.com.br/app_alemanha/insFunilaria.php';
			$http.post(link, {'id': id_user,'codigo': $scope.funilaria.veiculo,'observacoes': $scope.funilaria.observacoes})
			.success(function (funilaria,status,headers,config){
				console.log('retorno:'+funilaria);
				$location.url('/tab/principal');
				$cordovaDialogs.alert("Cadastro efetuado! Aguarde nosso contato","Mensagem");
			});
	};
})

.controller('carrosNovosCtrl', function($scope, $ionicSlideBoxDelegate, webDados, $location, $rootScope, $ionicLoading, $cordovaDialogs) {
	$scope.loading = $ionicLoading.show({content: 'carregando...',showBackdrop: false});
	if(typeof $rootScope.modelos === 'undefined' || $rootScope.modelos.length==0){
		webDados.getModelos("getModelos.php?id=4").then(function(dados){
			$scope.modelos = dados;
			$rootScope.modelos = dados;
			$ionicLoading.hide();
		}).catch(function(erro){
			console.log(erro);
			if(erro.status==0){
				$ionicLoading.hide();
				$cordovaDialogs.alert("Falha na conexão de dados","Mensagem");
			}
		});
		console.log('get');
	}else{
		$scope.modelos = $rootScope.modelos;
		console.log('igual');
		$ionicLoading.hide();
	}
})

.controller('editAgendamentoCtrl', function($scope, $window, $http, $location, $cordovaDialogs, $ionicLoading, $localstorage, $stateParams, webDados) {
 var id_user = $localstorage.get('user');
 $scope.loading = $ionicLoading.show({content: 'carregando...',showBackdrop: false});
 webDados.getModelos("getModelos.php?id=4").then(function(dados){$scope.modelos = dados;});
 var id_agendamento = $stateParams.id;
 $scope.getAgendamento = function(){
		$http.get("http://alemanhafichas.com.br/app_alemanha/getAgendamentoCliente.php?id="+id_agendamento)
		.success(function (response) {	
			$scope.agendar = response[0];
			$ionicLoading.hide();
			console.log($scope.agendar);
		})
	}
	$scope.getAgendamento();
	webDados.getServicos("getServicos.php?id=4").then(function(dados){
		$scope.servicos = dados;
	});
	webDados.getLojas("getLojas.php?id=4").then(function(dados){$scope.lojas = dados;});
	$scope.getAgendamento = function(){
		$http.get("http://alemanhafichas.com.br/app_alemanha/getAgendamento.php?id="+id_user)
		.success(function (response) {	
			$scope.agendamentos = response;		
					console.log($scope.veiculos);
			console.log($scope.agendamentos);
			$ionicLoading.hide();
			if($scope.agendamentos==0 && $scope.car!=0){$scope.modal.show();}	
		})
	}
	$scope.delAgendamento = function(){
		//$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
		
		$cordovaDialogs.confirm('Excluir o agendamento: '+$scope.agendar.servico+' ?', 'Confirme', ['Sim','Não'])
		.then(function(buttonIndex) {
		  // no button = 0, 'OK' = 1, 'Cancel' = 2
		  var btnIndex = buttonIndex;
			if(buttonIndex==1){
				$http.get("http://alemanhafichas.com.br/app_alemanha/delAgendamento.php?id="+id_agendamento)
				.success(function (response) {			
					if(response==1){
						$cordovaDialogs.alert("Erro!","Alerta");
					}else{
						$http.get("http://alemanhafichas.com.br/app_alemanha/getAgendamento.php?id="+id_user)
						.success(function (response) {	
							$scope.agendamentos = response;		
									console.log($scope.veiculos);
							console.log($scope.agendamentos);
							$ionicLoading.hide();
							if($scope.agendamentos==0 && $scope.car!=0){$scope.modal.show();}	
						})
						$location.url('/tab/agendamento');
						$window.location.reload();
					}
				})
			}
		});
	}
	$scope.altAgendamento = function(){
			console.log($scope.agendar);
			/*var link = 'http://www.alemanhafichas.com.br/app_alemanha/altVeiculo.php';
			$http.post(link, {'id': $scope.carro.id_veiculo_app,'placa': $scope.carro.placa,'ano_fabricacao': $scope.carro.ano_fabricacao,'ano_modelo': $scope.carro.ano_modelo})
			.success(function (carro,status,headers,config){
				console.log('retorno:'+carro);
				$scope.getVeiculo();
				$location.url('/tab/veiculos');
			});*/
	}
})

.controller('testdriveCtrl', function($scope, $http, $ionicHistory, $location, $localstorage, $cordovaDialogs, $ionicLoading, webDados, $rootScope) {
	var id_user = $localstorage.get('user');
	
	$scope.loading = $ionicLoading.show({content: 'carregando...',showBackdrop: false});
	
	if(typeof $rootScope.modelos === 'undefined' || $rootScope.modelos.length==0){
		webDados.getModelos("getModelos.php?id=4").then(function(dados){
			$scope.modelos = dados;
			$rootScope.modelos = dados;$ionicLoading.hide();
		}).catch(function(erro){
			console.log(erro);
			if(erro.status==0){
				$ionicLoading.hide();
				$cordovaDialogs.alert("Falha na conexão de dados","Mensagem");
			}
		});
		console.log('get');
	}else{
		$scope.modelos = $rootScope.modelos;
		console.log('igual');
		$ionicLoading.hide();
	}
	
	$scope.testdrive = {};
	$scope.insTestDrive = function(){
			console.log(id_user);
			console.log($scope.testdrive);	
			var link = 'http://www.alemanhafichas.com.br/app_alemanha/insTestDrive.php';
			$http.post(link, {'id': id_user,'codigo': $scope.testdrive.veiculo,'data': $scope.testdrive.data,'obs': $scope.testdrive.obs})
			.success(function (testdrive,status,headers,config){
				console.log('retorno:'+testdrive);
				$location.url('/tab/principal');
				$cordovaDialogs.alert("Cadastro efetuado! Aguarde nosso contato","Mensagem");
			});
	};
	
})

.controller('jornalCtrl', function($scope, $http, $localstorage, $sce) {
		var id_user = $localstorage.get('user');	
		$http.get("http://alemanhafichas.com.br/app_alemanha/getCliente.php?id="+id_user)
			.success(function (response) {
				$scope.dados = response;
				$localstorage.set('email', $scope.dados.cliente.email);
		});
		
		var mail = $localstorage.get('email');
		console.log(mail);
		//$scope.link_jornal = '<div class="caixa_alerta"><b>carregando...</b></div>';
		$scope.link_jornal =$sce.trustAsHtml('<iframe src="http://www.jornal.meionorte.com/api/assinante/acesso/externo?email='+mail+'&hash=asdqwo2132bcsansad0223sadraqw99mzbmxuuhyg" style="border: 0; position:fixed; top:0; left:0; right:0; bottom:0; width:100%; height:100%">');
		console.log($scope.link_jornal);
		
})

.controller('avaliacaoCtrl', function($scope, $stateParams, $http, $location, $cordovaDialogs, $localstorage, $ionicLoading ,webDados) {
	var id_user = $localstorage.get('user');
	$scope.loading = $ionicLoading.show({
      content: 'carregando...',
      showBackdrop: false
    });
	var id_modelo = $stateParams.id;
	webDados.getModelos("getModeloCliente.php?id="+id_modelo).then(function(dados){
		$scope.modelo = dados[0];
		$ionicLoading.hide();
	}).catch(function(erro){
			console.log(erro);
			if(erro.status==0){
				$ionicLoading.hide();
				$cordovaDialogs.alert("Falha na conexão de dados","Mensagem");
			}
	});
	
	$scope.onFileSelect = function($files) {
		console.log('upload');
		$scope.message = "";
		for (var i = 0; i < $files.length; i++) {
			var file = $files[i];
			console.log(file);
			$scope.upload = $upload.upload({
				url: 'http://alemanhafichas.com.br/app_alemanha/upload.php',
				method: 'POST',               
				file: file
			}).success(function(data, status, headers, config) {
				$scope.message = data;                
			}).error(function(data, status) {
				$scope.message = data;
			});
		}
	};
	
	$scope.novo = {};
	$scope.insQueroNovo = function() {
		$ionicLoading.show({duration: 5000});
		console.log(id_user);
		console.log($scope.modelo.id_modelo_veiculo);
		console.log($scope.novo);
		
		var link = 'http://www.alemanhafichas.com.br/app_alemanha/insQueroNovo.php';
			$http.post(link, {'id': id_user,'modelo': $scope.modelo.id_modelo_veiculo,'perfil_cliente': $scope.novo.perfil,'entrada': $scope.novo.entrada,'parcelas': $scope.novo.parcelas,'veiculo_usado': $scope.novo.veiculo,'portas_usado': $scope.novo.portas,'combustivel_usado': $scope.novo.combustivel,'cambio_usado': $scope.novo.cambio,'quilometragem_usado': $scope.novo.quilometragem,'ano_fab_usado': $scope.novo.ano_fab,'ano_mod_usado': $scope.novo.ano_mod,'obs': $scope.novo.obs})
			.success(function (queronovo,status,headers,config){
				$ionicLoading.hide();
				console.log(parseInt(queronovo, 10));
				$location.url('/tab/principal');
				if(parseInt(queronovo, 10)==0){
					$cordovaDialogs.alert("Veículo já cadastrado!","Mensagem");
				}else{
					$cordovaDialogs.alert("Cadastro efetuado! Aguarde nosso contato","Mensagem");
				}
			});
		
	}
})

.controller('seguroCtrl', function($scope, $rootScope, $http, $cordovaDialogs, $location, $ionicLoading, $localstorage, webDados) {
	
	$scope.loading = $ionicLoading.show({content: 'carregando...',showBackdrop: false});
	var id_user = $localstorage.get('user');

	if(typeof $rootScope.veiculos === 'undefined' || $rootScope.veiculos.length==0){
		webDados.getVeiculos("getVeiculo.php?id="+id_user).then(function(dados){
			$scope.veiculos = dados;
			$rootScope.veiculos = dados;
			if($scope.veiculos==0){$location.url('/tab/veiculos');}
			$ionicLoading.hide();
		}).catch(function(erro){
			console.log(erro);
			if(erro.status==0){
				$ionicLoading.hide();
				$cordovaDialogs.alert("Falha na conexão de dados","Mensagem");
			}
		});
		console.log('get');
	}else{
		$scope.veiculos = $rootScope.veiculos;
		$ionicLoading.hide();
		console.log('igual');
	}
	
	$scope.seguro = [];
	$scope.insSeguro = function(){
			console.log($scope.seguro);	
			var link = 'http://www.alemanhafichas.com.br/app_alemanha/insSeguro.php';
			$http.post(link, {'id': id_user,'codigo': $scope.seguro.veiculo,'observacoes': $scope.seguro.observacoes})
			.success(function (seguro,status,headers,config){
				console.log('retorno:'+seguro);
				$location.url('/tab/principal');
				$cordovaDialogs.alert("Cadastro efetuado! Aguarde nosso contato","Mensagem");
			});
	};
})

.controller('lojasCtrl', function($scope, webDados, $ionicLoading, $cordovaDialogs) {
	$scope.loading = $ionicLoading.show({
      content: 'carregando...',
      showBackdrop: false
    });
	webDados.getLojas("getLojas.php?id=4").then(function(dados){
		$scope.lojas = dados;
		console.log(dados);
		$ionicLoading.hide();
	}).catch(function(erro){
			console.log(erro);
			if(erro.status==0){
				$ionicLoading.hide();
				$cordovaDialogs.alert("Falha na conexão de dados","Mensagem");
			}
	});
})

.controller('contatoCtrl', function($scope, $http, $localstorage, $cordovaDialogs, $location) {
	var id_user = $localstorage.get('user');	
	$scope.contato = [];
	$scope.insContato = function(){
			console.log($scope.seguro);	
			var link = 'http://www.alemanhafichas.com.br/app_alemanha/insContato.php';
			$http.post(link, {'id': id_user,'departamento': $scope.contato.departamento,'assunto': $scope.contato.assunto,'mensagem': $scope.contato.mensagem})
			.success(function (contato,status,headers,config){
				console.log('retorno:'+contato);
				$location.url('/tab/principal');
				$cordovaDialogs.alert("Cadastro efetuado! Aguarde nosso contato","Mensagem");
			});
	};
})

.controller('perfilCtrl', function($scope, $window, $http, $ionicModal, $cordovaDialogs, $location, $localstorage, $ionicLoading, $localstorage, webDados, $rootScope) {
	
	var id_user = $localstorage.get('user');	

	$scope.getCliente = function(){
		$scope.loading = $ionicLoading.show({content: 'carregando...',showBackdrop: false});
		$http.get("http://alemanhafichas.com.br/app_alemanha/getCliente.php?id="+$localstorage.get('user'))
			.success(function (response) {
				$scope.perfil = response;
				$ionicLoading.hide();
				//console.log(response);
		}).error(function(data, status) {
				console.log('erro');
				console.log(data);
		});
	};
		
	$scope.loadUsuario = function(){
		$location.url('/tab/principal');
		$cordovaDialogs.alert('status'+$localstorage.get('user'),"Mensagem");
		$window.location.reload();
		
	}
	
	$scope.desconectar = function(){
		$window.localStorage.clear();
		$localstorage.set('user', 0);
		$location.url('/login');
		console.log($localstorage.get('user'));
	}
	
	$scope.perfil = [];
	$scope.altCliente = function(){
			console.log(id_user);	
			var link = 'http://www.alemanhafichas.com.br/app_alemanha/altCliente.php';
			$http.post(link, {'id': id_user,'nome': $scope.perfil.cliente.nome,'email': $scope.perfil.cliente.email,'celular': $scope.perfil.cliente.celular})
			.success(function (perfil,status,headers,config){
				console.log('retorno:'+perfil);
				$scope.getCliente();
				$scope.modal.hide();
			});
	};
	
	$scope.$on('$ionicView.enter',function(){
		$scope.getCliente();
	});
	
	$ionicModal.fromTemplateUrl('templates/modal-editperfil.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
})

.controller('alertImgCtrl', function($scope, $http,$filter, $location, $cordovaDialogs, $ionicLoading, $window, $localstorage, $stateParams) {
	$scope.imgShow = false;
	$scope.loading = $ionicLoading.show({content: 'carregando...',showBackdrop: false});
	var id_user = $localstorage.get('user');
	var id_alerta = $stateParams.id;
	console.log('id_alerta:'+id_alerta+' corrigir getImgNotificacao para id_alerta');

	$http.get("http://alemanhafichas.com.br/app_alemanha/getImgNotificacao.php?id="+id_user+"&ida="+id_alerta)
		.success(function (response) {
			$scope.alerta = response;
			console.log($scope.alerta);
			$ionicLoading.hide();
			console.log($scope.alerta[0].link_notificacao)
			if($scope.alerta[0].link_notificacao!=''){$scope.imgShow = true;}else{$scope.imgShow = false;}
			/*if($scope.alertas!=0){
				$scope.alerta = $filter('filter')($scope.alertas, { id: id_alerta });
				//$scope.alerta.link_img = $filter('filter')($scope.alertas, { link_notificacao: id_alerta });
				console.log($scope.alerta[0].link_notificacao);
				
			}else{
				$location.url('/tab/alert');
			}	*/
	});
	
	$scope.getAlertas = function(){
		$http.get("http://alemanhafichas.com.br/app_alemanha/getNotificacao.php?id="+id_user)
			.success(function (response) {
				$scope.alertas = response;
				$ionicLoading.hide();
				
		});
	}
	
	$scope.confirmaAlerta = function(id,id_ag){
		var link = 'http://www.alemanhafichas.com.br/app_alemanha/confirmaAlertaAgendamento.php';
				$http.post(link, {'id': id,'id_ag': id_ag,'aceita': $scope.alerta.aceita})
				.success(function (confirma,status,headers,config){		
					$scope.getAlertas();
					$location.url('/tab/alert');
					$window.location.reload();
					$cordovaDialogs.alert("Confirmado!","Mensagem");
				});
				
		
	}
})

.controller('alertTxtCtrl', function($scope, $http, $location, $cordovaDialogs, $ionicLoading, $localstorage, $window, $stateParams) {
	$scope.loading = $ionicLoading.show({content: 'carregando...',showBackdrop: false});
	var id_user = $localstorage.get('user');
	var id_alerta = $stateParams.id;
	console.log('parametro:'+id_alerta);
		
	$http.get("http://alemanhafichas.com.br/app_alemanha/getTxtNotificacao.php?id="+id_user+"&ida="+id_alerta)
		.success(function (response) {
			$scope.alertas = response;
			$ionicLoading.hide();
			console.log(response);
	});
	$scope.pesquisa = {};
	$scope.pesquisa.id = id_user;

	$scope.respostaPesquisa = function(id_alt){
		$ionicLoading.show();
		$scope.pesquisa.id_alt = id_alt;
		console.log($scope.pesquisa);
		
		var link = 'http://www.alemanhafichas.com.br/app_alemanha/insPesquisa.php';
			$http.post(link, $scope.pesquisa)
			.success(function (pesquisa,status,headers,config){
				console.log(pesquisa);
				$location.url('/tab/alert');
				$window.location.reload();
				$cordovaDialogs.alert("Obrigado por sua participação!","Mensagem");
			});
	
	}
})
.controller('alertCtrl', function($scope, $window, $cordovaDialogs, $ionicModal, $timeout, $location, $http, $localstorage, $ionicLoading, MySimulatedSlowHTTPService, $rootScope, $cordovaNetwork) {


	document.addEventListener("deviceready", function () {

    var type = $cordovaNetwork.getNetwork()

    var isOnline = $cordovaNetwork.isOnline()

    var isOffline = $cordovaNetwork.isOffline()


    // listen for Online event
    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
      var onlineState = networkState;
	  console.log('asas');
    })

    // listen for Offline event
    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
      var offlineState = networkState;
	  console.log('asas');
    })

  }, false);
	
	
	
	$scope.loading = $ionicLoading.show({content: 'carregando...',showBackdrop: false});
	
	var id_user = $localstorage.get('user');	
	
	$scope.mustShowImg = false;
	
	$scope.getAlertas = function(){
		$http.get("http://alemanhafichas.com.br/app_alemanha/getNotificacao.php?id="+$localstorage.get('user'))
			.success(function (response) {
				$scope.alertas = response;
				$ionicLoading.hide();
				if (response!=0){
					$scope.quant_alerta = response;
					$rootScope.quant_alerta = 3;					
					$scope.mustShow=true;
				}else{
					$scope.quant_alerta = 0;
					$rootScope.quant_alerta = 0;
					$scope.mustShow=false;
				}	
		}).catch(function(erro){
			console.log(erro);
			if(erro.status==0){
				$ionicLoading.hide();
				$cordovaDialogs.alert("Falha na conexão de dados","Mensagem");
			}
		});
	}
	
	//console.log($window);
	
	$scope.confirmaAlerta = function(id,id_ag){
		
		var link = 'http://www.alemanhafichas.com.br/app_alemanha/confirmaAlertaAgendamento.php';
			$http.post(link, {'id': id,'id_ag': id_ag})
			.success(function (confirma,status,headers,config){
				//$location.url('/tab/principal');
				$scope.getAlertas();
				$scope.modal.hide();
				$location.url('/tab/principal');
				$cordovaDialogs.alert("Confirmado!","Mensagem");
			}).error(function(data, status, headers, config){console.log(status);});	
	}
	
	$scope.$on('$ionicView.enter', function(){
		$scope.getAlertas();
	});
	
	$ionicModal.fromTemplateUrl('templates/modal-alert.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
	
});

function getGenerico(url,id) {
	console.log('TESTE DE FUNCTION'+url+'|'+id);
	var link = "http://alemanhafichas.com.br/app_alemanha/"+url;
	$http.get(link).then(function(response){
	veiculos = response.data;
	//return veiculos;
	});
}

function agendamentoCtrl($scope, $window) {

}