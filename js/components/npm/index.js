"use strict";

var angular = require('angular');
require('../../factories/git-parser');

var App = angular.module('app.npm');

App.directive('projectGit', projectGulp);

function projectGulp () {
  var directive = {
    templateUrl: __dirname + '/template.html',
    restrict: 'EA',
    scope: {
      projct: "="
    },
    controller: controller,
    controllerAs: 'PGT',
    bindToController: true
  };

  return directive;
}

controller.$inject = ['gitParser'];

function controller( gitParser) {
  var PGT = this;

  if (!PGT.projct) {return}

  PGT.show = 'bash';
  PGT.exclude = gitParser.getGitExclude(PGT.projct.path);
  PGT.ignore = gitParser.getGitIgnore(PGT.projct.path);
  PGT.saveExclude = saveExclude;
  PGT.saveIgnore = saveIgnore;

  function saveExclude() {
    gitParser.setGitExclude(PGT.projct.path, PGT.exclude);
  }

  function saveIgnore() {
    gitParser.setGitIgnore(PGT.projct.path, PGT.ignore);
  }
}