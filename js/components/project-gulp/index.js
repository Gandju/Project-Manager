"use strict";

var angular = require('angular');
require('../../factories/gulp-parser');

var App = angular.module('app.project-gulp', ['app.gulp-parser', 'app.notification']);

App.directive('projectGulp', projectGulp);

function projectGulp () {
  var directive = {
    templateUrl: __dirname + '/template.html',
    restrict: 'EA',
    scope: {
      projct: "="
    },
    controller: controller,
    controllerAs: 'PG',
    bindToController: true
  };

  return directive;
}

controller.$inject = ['$rootScope', 'gulpParser'];

function controller($rootScope, gulpParser) {
  var PG = this;
  var bashId = 'gulp';

  if (!PG.projct) {return}

  PG.tasks = gulpParser.getTasks(PG.projct.path);
  PG.startTask = startTask;
  PG.gulpLog = "";

  function startTask(task) {
    $rootScope.$broadcast("sendBashTask", {
      id: bashId,
      task: task
    });
  }
}