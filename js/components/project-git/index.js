"use strict";

var angular = require('angular');
var exec = require('child_process').exec;
require('../../factories/git-parser');

var App = angular.module('app.project-git', ['app.git-parser']);

App.directive('projectGit', projectGulp);

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

controller.$inject = ['$scope', '$interval', 'gitParser'];

function controller($scope, $interval, gitParser) {
  var PG = this;
  var child = null;

  if (!PG.projct) {return}

  PG.bashMessage = "";
  PG.bashInput = "";
  PG.show = 'bash';
  PG.exclude = gitParser.getGitExclude(PG.projct.path);
  PG.ignore = gitParser.getGitIgnore(PG.projct.path);
  PG.keypress = keypress;
  PG.saveExclude = saveExclude;
  PG.saveIgnore = saveIgnore;

  $scope.$on("$destroy", destroyHandler);

  function keypress() {
    PG.bashMessage += '\n> git ' + PG.bashInput;

    gitBash(PG.bashInput);

    PG.bashInput = '';
  }

  function saveExclude() {
    gitParser.setGitExclude(PG.projct.path, PG.exclude);
  }

  function saveIgnore() {
    gitParser.setGitIgnore(PG.projct.path, PG.ignore);
  }

  function gitBash(task) {
    child = exec("git " + task, {cwd: PG.projct.path}, function (error, message) {
      var msg = message.length ? message : error.message;

      PG.bashMessage += '\n> ' + msg;
      $scope.$digest();
    });


  }

  function destroyHandler () {
    if (child) {
      child.kill()
    }
  }
}