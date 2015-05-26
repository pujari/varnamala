var app = angular.module('app', ['ngRoute', 'ngResource', 'ngSanitize','app.directives']).
     config(function($routeProvider) {
    	 $routeProvider.when('/index', {
    		 templateUrl: 'partials/varnamala.html'
    	 }).otherwise({
    		 redirectTo: '/index'
    	 });
     });
var directives = angular.module('app.directives', []);
var filters = angular.module('app.filters', []);

//register all sounds
//createjs.Sound.addEventListener("fileload", handleLoadComplete);
for(var i=0;i<=53;i++){
	createjs.Sound.registerSound({src:"sound/mp3/"+ i + ".mp3", id:""+(i-1)});
}