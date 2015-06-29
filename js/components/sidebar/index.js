"use strict";

var angular = require('angular');
require('../../factories/projects');

var App = angular.module('app.sidebar', ['app.projects']);

App.directive('sidebar', sidebar);

function sidebar () {
  var directive = {
    templateUrl: __dirname + '/template.html',
    restrict: 'EA',
    scope: {},
    controller: controller,
    controllerAs: 'sb',
    bindToController: true
  };

  return directive;
}

controller.$inject = ['$rootScope', '$location', 'projects'];

function controller($rootScope, $location, projects) {
  var sb = this;

  sb.projects = projects.getProjects() || [];
  sb.projectPath = null;
  sb.active = null;
  sb.addProject = addProject;
  sb.removeProject = removeProject;

  function addProject() {
    projects.addProject(sb.projectPath).then(function (project) {
      sb.projects.push(project);
    }, function (error) {
      console.log(error);

      $rootScope.$broadcast('alert', {
        type: 'danger',
        message: error
      });
    }).finally(function () {
      sb.projectPath = null;
    })
  }

  function removeProject(name, version) {
    sb.projects = projects.removeProject(name, version);
    $location.path('/');
  }

}