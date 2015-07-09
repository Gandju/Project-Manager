global.document = window.document;

var angular = global.angular = require('angular');
require('angular-route');
require('angular-local-storage');
require('angular-bootstrap');
require('jsonformatter');
require('./components/sidebar');
require('./components/project');
require('./components/project-info');
require('./components/project-gulp');
require('./components/project-git');
require('./components/bash');

angular.module('ProjectManager',
  ['ngRoute', 'ui.bootstrap', 'LocalStorageModule', 'jsonFormatter', 'app.sidebar', 'app.project', 'app.project-info',
   'app.project-gulp', 'app.project-git', 'app.bash']);

angular
  .module('ProjectManager')
  .controller('AppController', AppController)
  .config(function (localStorageServiceProvider, $routeProvider) {
    localStorageServiceProvider.setPrefix('ProjectManager');

    $routeProvider.when('/project/:name/:version', {
      template: "<project></project>"
    })
});

AppController.$inject = ["$rootScope"];

function AppController($rootScope) {
  var appCtrl = this;
  appCtrl.alerts = [];
  appCtrl.closeAlert = closeAlert;

  $rootScope.$on('alert', addAlert);

  function closeAlert(index) {
    appCtrl.alerts.splice(index, 1);
  }

  function addAlert(event, data) {
    appCtrl.alerts.push(data);
  }
}