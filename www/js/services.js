angular.module('starter.services', [])
/*
.service('LoginService', function($q,$http) {
	return {
        loginUser: function(name, pw, email, senha) {
            var deferred = $q.defer();
            var promise = deferred.promise;
			
			if (angular.equals(name,email) && angular.equals(pw,senha)) {	
                deferred.resolve('Welcome ' + name + '!');
				console.log("login.Ok");
            } else {
                deferred.reject('Erro: email ou senha errado.');
            }
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})
*/
.factory(("ionPlatform"), function( $q ){
    var ready = $q.defer();

    ionic.Platform.ready(function( device ){
        ready.resolve( device );
    });

    return {
        ready: ready.promise
    }
})

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.factory('MySimulatedSlowHTTPService', function($q, $timeout) {
    var deferred = $q.defer();
    $timeout(function() {
        // Simulated slow fetch from an HTTP server
        deferred.resolve(['Item 1', 'Item 2', 'Item 3'])
    }, 3000);
    return deferred.promise;
})


.service('webDados', function($http, $location) {
	return {
		getLogin: function(email,senha){
			email = email.toLowerCase();
			var link = "http://alemanhafichas.com.br/app_alemanha/getLogin.php?e="+email+"&s="+senha; 
			return $http.get(link).then(function(response){
				return response.data;
				/*if(response.data==0){
					return response.data;
				}else{
					login = response.data[0].id;
					return login;					
				}*/
			});
		},
		setToken: function(url,token){
			var link = 'http://www.alemanhafichas.com.br/app_alemanha/'+url;
			return $http.post(link, {'id': usuario,'token': device.token})
			.success(function (dados){
				return dados.data;
			});
		},
		getLojas: function(url){
			var link = "http://alemanhafichas.com.br/app_alemanha/"+url; 
			return $http.get(link).then(function(response){
				lojas = response.data;
				return lojas;
			});
		},
		getVeiculos: function(url){
			var link = "http://alemanhafichas.com.br/app_alemanha/"+url;
			return $http.get(link).then(function(response){
				veiculos = response.data;
				return veiculos;
			});
		},
		getServicos: function(url){
			var link = "http://alemanhafichas.com.br/app_alemanha/"+url;
			return $http.get(link).then(function(response){
				servicos = response.data;
				return servicos;
			});
		},
		setVeiculo: function(url,usuario,veiculo){
			var link = 'http://www.alemanhafichas.com.br/app_alemanha/'+url;
			return $http.post(link, {'id': usuario,'modelo': veiculo.modelo,'placa': veiculo.placa,'ano_fabricacao': veiculo.ano_fabricacao,'ano_modelo': veiculo.ano_modelo,'km_atual': veiculo.km_atual,'data_seguro': veiculo.data_seguro,'nome_seguradora': veiculo.nome_seguradora})
			.success(function (veiculo){
				return veiculo.data;
			});
		},
		setCliente: function(url,cliente){
			var link = 'http://www.alemanhafichas.com.br/app_alemanha/'+url;
			return $http.post(link, {'nome': cliente.nome,'email': cliente.email,'senha': cliente.senha,'celular': cliente.celular})
			.success(function (retorno){
				return retorno.data;
				console.log(retorno);
			});
		},
		getModelos: function(url){
			var link = "http://alemanhafichas.com.br/app_alemanha/"+url;
			return $http.get(link).then(function(response){
				modelos = response.data;
				return modelos;
			});
		}
	}
});