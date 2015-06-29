"use strict";

var angular = require('angular');
require('../../factories/projects');

var App = angular.module('app.project-info', ['app.projects']);

App.directive('projectInfo', projectInfo);

function projectInfo () {
  var directive = {
    templateUrl: __dirname + '/template.html',
    restrict: 'EA',
    scope: {
      projct: "="
    },
    controller: controller,
    controllerAs: 'PI',
    bindToController: true
  };

  return directive;
}

controller.$inject = ['$rootScope', '$routeParams', 'projects'];

function controller($rootScope, $routeParams, projects) {
  var PI = this;

  if (!PI.projct) {return}

  PI.projct.packageJSON = projects.getPackage(PI.projct.packageUrl);
  PI.projct.packageOBJ = JSON.parse(PI.projct.packageJSON);
  PI.editPackageJSON = false;
  PI.edit = edit;
  PI.save = save;
  PI.cancel = cancel;
  PI.create = create;

  function edit() {
    PI.editPackageJSON = true;
  }

  function save() {
    try {
      JSON.parse(PI.projct.packageJSON);
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: 'JSON не валиден!'
      }
    }

    projects.setPackage(PI.projct.package, PI.projct.packageJSON);
    PI.projct.packageOBJ = JSON.parse(PI.projct.packageJSON);
    PI.editPackageJSON = false;

    return {
      success: true,
      message: 'Package успешно сохранён!'
    }
  }

  function cancel() {
    PI.projct.packageJSON = projects.getPackage(PI.projct.packageUrl, PI.projct.name);
    PI.editPackageJSON = false;
  }

  function create() {
    var packageJSON = projects.createPackage(PI.projct.packageUrl, PI.projct.name);

    PI.projct.packageJSON = packageJSON;
    PI.projct.packageOBJ = JSON.parse(packageJSON);
  }
}