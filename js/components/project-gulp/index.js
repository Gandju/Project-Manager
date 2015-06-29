"use strict";

var angular = require('angular');
var exec = require('child_process').exec;
require('../../factories/gulp-parser');
require('../../factories/notification');

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

controller.$inject = ['$scope', '$interval', 'gulpParser', 'notification'];

function controller($scope, $interval, gulpParser, notification) {
  var PG = this;
  var interval = null;
  var child = null;

  if (!PG.projct) {return}

  PG.tasks = gulpParser.getTasks(PG.projct.path);
  PG.startTask = startTask;
  PG.gulpLog = "";

  $scope.$on("$destroy", destroyHandler);

  function startTask(task) {
    var id = 0;
    var loader = "\\|/—";

    interval = $interval(function() {
      PG.gulpLog = id < 4 ? loader[id] : loader[0];
      id = id + 1 === 4 ? 0 : id + 1;
    }, 42);

    child = exec("gulp " + task, {cwd: PG.projct.path}, function (error, message) {
      var msg = message.length ? message : error.message;
      var nt = null;

      if (error) {
        console.log(msg);
        nt = notification.newNotification('Во время таска произошла ошибка!', {
          body: msg
        });
      } else {
        nt = notification.newNotification('Таск выполнен успешно!');
      }
      nt.onclick = clickNotificationHandler;

      $interval.cancel(interval);

      PG.gulpLog = msg;
      $scope.$digest();
    });

    function clickNotificationHandler () {
      window.WIN.focus();
      $scope.$digest();
    }
  }

  function destroyHandler () {
    if (interval) {
      $interval.cancel(interval);
    }

    if (child) {
      child.kill()
    }
  }
}