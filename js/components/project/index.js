"use strict";

var angular = require('angular');
require('../../factories/projects');
require('../../factories/gulp-parser');
require('../../factories/git-parser');

var App = angular.module('app.project', ['app.projects', 'app.gulp-parser', 'app.git-parser']);

App.directive('project', project);

function project () {
  var directive = {
    templateUrl: __dirname + '/template.html',
    restrict: 'EA',
    scope: {},
    controller: controller,
    controllerAs: 'p',
    bindToController: true
  };

  return directive;
}

controller.$inject = ['$routeParams', '$location', 'projects', 'gulpParser', 'gitParser'];

function controller($routeParams, $location, projects, gulpParser, gitParser) {
  var p = this;

  p.project = projects.getProject($routeParams.name, $routeParams.version);

  if (!p.project) {
    $location.path('/');
    return;
  }

  p.hasGulp = gulpParser.hasGulp(p.project.path);
  p.hasGit = gitParser.hasGit(p.project.path);
}