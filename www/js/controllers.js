angular.module('starter.controllers', ['ionic','ngCordova'])

.controller('loginCtrl', function($scope, $http, $location, $cordovaDialogs, $ionicModal, webDados) {
	$scope.login = {};//chave ok
	$scope.getLogin = function(){
		webDados.getLogin($scope.login.email,$scope.login.senha).then(function(dado){
			console.log('retorno1:'+dado);
			window.localStorage.setItem("usuario", dado);
			if(dado==0){$location.url('/login');$cordovaDialogs.alert("Login inválido!","Mensagem");}else{$location.url('/tab/principal');}
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
	$ionicModal.fromTemplateUrl('templates/modal-esquecisenha.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});
})

.controller('cadastrarCtrl', function($scope, $ionicModal, $cordovaDialogs, $cordovaToast, $location, webDados) {
	$scope.cliente = [];
	console.log('teste1:'+$scope.cliente);
	$scope.insCliente = function(){
		webDados.setCliente("insCliente.php",$scope.cliente).then(function(dados){
			console.log(dados);
			if (dados.data!=0){
				$location.url('/tab/principal');
				window.localStorage.setItem("usuario", dados.data);
				//$cordovaDialogs.alert("Cadastro efetuado com sucesso!","Mensagem");
				//$cordovaToast.showLongCenter('Cadastro efetuado com sucesso!');
			}else{
				console.log('erro');
				$scope.retorno = "erro";
				//$cordovaToast.showShortCenter('Registered for push notifications');
			}
		});
	};
})

.controller('principalCtrl', function($scope, $cordovaPush, $location, $cordovaDialogs, $cordovaMedia, $cordovaToast, $http, $cordovaDevice) {
	var id_user = window.localStorage.getItem("usuario");
	if(id_user==0){$location.url('/login');}
	console.log(id_user);
	$scope.alertas = 10;
	$scope.getAlertas = function(){
		$http.get("http://alemanhafichas.com.br/app_alemanha/getQntAlertas.php?id="+id_user)
		.success(function (response) {	
			console.log('aler'+response);		
			if (response!=0){
				$scope.quant_alerta = response;	
			}else{
				$scope.alerta = 0;
			}
		})
		$http.get("http://alemanhafichas.com.br/app_alemanha/getNotificacao.php?id="+id_user)
		.success(function (response) {
			$scope.alertas = response;
			console.log(response);
		});
	}
	$scope.getAlertas();

/*
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

	ionic.Platform.ready(function(){
		$scope.register();
	});
	
    // Notification Received
    $scope.$on('$cordovaPush:notificationReceived', function (event, notification) {
        console.log("notificacao:"+JSON.stringify([notification]));
        if (ionic.Platform.isAndroid()) {
			$scope.token = notification;
			$scope.key = notification.regid; //post cliente
			//----------
			$scope.altToken = function(){
				var link = 'http://www.alemanhafichas.com.br/app_alemanha/altToken.php';
				$http.post(link, {'id': id_user,'token': $scope.key})
				.success(function (token,status,headers,config){
					//console.log('retorno:'+token);
				});
			};
			$scope.altToken();
			//------------
            handleAndroid(notification);
        }
        else if (ionic.Platform.isIOS()) {
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
        }
        else if (notification.event == "message") {
            //$cordovaDialogs.alert(notification.message, "Push Notification Received");
			$scope.getAlertas();
			$location.url('/tab/alert');
            $scope.$apply(function () {
                $scope.notifications.push(JSON.stringify(notification.message));
            })
        }
        else if (notification.event == "error")
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
	*/
})

.controller('veiculosCtrl', function($scope, $ionicModal, $cordovaToast, webDados) {
	var id_user = window.localStorage.getItem("usuario");
	console.log('usuario:'+id_user);
	$scope.getVeiculos = function(){
		webDados.getVeiculos("getVeiculo.php?id="+id_user).then(function(dados){$scope.veiculos = dados;});
	}
	$scope.getVeiculos();
	webDados.getModelos("getModelos.php?id=4").then(function(dados){$scope.modelos = dados;});
	$scope.veiculo = [];
	$scope.insVeiculo = function(){
		webDados.setVeiculo("insVeiculo.php",id_user,$scope.veiculo).then(function(dados){
			if (dados.data!=0){
				$scope.getVeiculos();
				$scope.modal.hide();
			}else{
				$cordovaToast.showLongCenter('Veículo já cadastrado!');
			}
		});
	};
    $ionicModal.fromTemplateUrl('templates/modal-addcar.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
})

.controller('agendamentoCtrl', function($scope, $http, $ionicModal, webDados) {
	var id_user = window.localStorage.getItem("usuario");
	console.log('usuario:'+id_user);
	webDados.getVeiculos("getVeiculo.php?id="+id_user).then(function(dados){
		$scope.veiculos = dados;
	});
	webDados.getServicos("getServicos.php?id=4").then(function(dados){
		$scope.servicos = dados;
	});
	webDados.getLojas("getLojas.php?id=4").then(function(dados){$scope.lojas = dados;});
	$scope.getAgendamento = function(){
		$http.get("http://alemanhafichas.com.br/app_alemanha/getAgendamento.php?id="+id_user)
		.success(function (response) {		
			if (response!=0){
				$scope.agendamentos = response;
				console.log(response);
			}else{
				$scope.agendamentos = '';
			}
			$scope.$emit('UNLOAD');	
		})
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

.controller('funilariaCtrl', function($scope, $http, $cordovaDialogs, $location, webDados) {
	var id_user = window.localStorage.getItem("usuario");
	console.log('usuario:'+id_user);
	webDados.getVeiculos("getVeiculo.php?id="+id_user).then(function(dados){
		$scope.veiculos = dados;
		console.log(dados);
	});
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

.controller('carrosNovosCtrl', function($scope, $ionicSlideBoxDelegate) {

  $scope.nextSlide = function() {
    $ionicSlideBoxDelegate.next();
  }
})

.controller('testdriveCtrl', function($scope, webDados) {
	webDados.getModelos("getModelos.php?id=4").then(function(dados){$scope.modelos = dados;});
	var id_user = window.localStorage.getItem("usuario");
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

.controller('jornalCtrl', function($scope) {
	
})

.controller('avaliacaoCtrl', function($scope, webDados) {
	webDados.getModelos("getModelos.php?id=4").then(function(dados){$scope.modelos = dados;});
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
})

.controller('seguroCtrl', function($scope, $http, $cordovaDialogs, $location, webDados) {
	var id_user = window.localStorage.getItem("usuario");
	webDados.getVeiculos("getVeiculo.php?id="+id_user).then(function(dados){
		$scope.veiculos = dados;
		console.log(dados);
	});
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

.controller('lojasCtrl', function($scope, webDados) {
	webDados.getLojas("getLojas.php?id=4").then(function(dados){$scope.lojas = dados;console.log(dados)});
})

.controller('contatoCtrl', function($scope, $http) {
	var id_user = window.localStorage.getItem("usuario");	
	$scope.contato = [];
	$scope.insContato = function(){
			console.log($scope.seguro);	
			var link = 'http://www.alemanhafichas.com.br/app_alemanha/insContato.php';
			$http.post(link, {'id': id_user,'departamento': $scope.contato.departamento,'assunto': $scope.contato.assunto,'mensagem': $scope.contato.mensagem})
			.success(function (contato,status,headers,config){
				console.log('retorno:'+contato);
			});
	};
})

.controller('perfilCtrl', function($scope, $http, $ionicModal, webDados) {
	var id_user = window.localStorage.getItem("usuario");	
	$scope.getCliente = function(){
		$http.get("http://alemanhafichas.com.br/app_alemanha/getCliente.php?id="+id_user)
			.success(function (response) {
				$scope.perfil = response;
				console.log(response);
		});
	};
	$scope.getCliente();
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
	$ionicModal.fromTemplateUrl('templates/modal-editperfil.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
})
.controller('alertImgCtrl', function($scope, $http, $stateParams) {
	var id_user = window.localStorage.getItem("usuario");
	var id_alerta = $stateParams.id;
	console.log('parametro:'+id_alerta);
		
	$http.get("http://alemanhafichas.com.br/app_alemanha/getImgNotificacao.php?id="+id_user+"&ida="+id_alerta)
		.success(function (response) {
			$scope.alertas = response;
			console.log(response);
	});
})
.controller('alertTxtCtrl', function($scope, $http, $stateParams) {
	var id_user = window.localStorage.getItem("usuario");
	var id_alerta = $stateParams.id;
	console.log('parametro:'+id_alerta);
		
	$http.get("http://alemanhafichas.com.br/app_alemanha/getTxtNotificacao.php?id="+id_user+"&ida="+id_alerta)
		.success(function (response) {
			$scope.alertas = response;
			console.log(response);
	});
})
.controller('alertCtrl', function($scope, $http) {
	var id_user = window.localStorage.getItem("usuario");	
	$http.get("http://alemanhafichas.com.br/app_alemanha/getNotificacao.php?id="+id_user)
		.success(function (response) {
			$scope.alertas = response;
			console.log(response);
	});
	console.log('teste');
});
