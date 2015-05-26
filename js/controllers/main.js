'use strict';
/* Controllers */

var controllers = angular.module('app.controllers', []);

controllers.controller('NavCtrl', [ '$scope', '$location',
                                    function($scope, $location) {
	$scope.isActive = function(route) {
		return route == $location.path();
	};
} ]);

controllers.controller('HomeCtrl',
	[
	 '$scope',
	 '$rootScope',
	 '$location',
	 function ($scope, $rootScope, $location) {
		 alert("here");
	 }
]);