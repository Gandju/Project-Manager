"use strict";

var angular = require('angular');
var exec = require('child_process').exec;

require('../../factories/notification');

var App = angular.module('app.bash', []);

App.directive('bash', projectGulp);

function projectGulp () {
  var directive = {
    templateUrl: __dirname + '/template.html',
    restrict: 'EA',
    scope: {
      messages: "=",
      showInput: "=",
      showNotification: "=",
      prefix: "=",
      path: "=",
      bushId: "="
    },
    controller: controller,
    controllerAs: 'B',
    bindToController: true
  };

  return directive;
}

controller.$inject = ['$rootScope', '$scope', '$interval', 'notification'];

function controller($rootScope, $scope, $interval, notification) {
  var B = this;
  var child = null;
  var interval = null;

  B.messages = "";
  B.input = "";
  B.submit = submit;
  B.loader = "";

  $rootScope.$on("sendBashTask", sendBashTaskHandler);

  $scope.$on("$destroy", destroyHandler);

  function submit() {
    var task = B.prefix + ' ' + B.input;
    B.messages += '\n> ' + task;

    sendScript(task);

    B.input = "";
  }

  function sendBashTaskHandler(event, data) {
    if (data.id === B.bushId) {
      var task = B.prefix + ' ' + data.task;
      B.messages += '\n> ' + task;

      sendScript(task);
    }
  }

  function sendScript(task) {
    startLoader();

    child = exec(task, {cwd: B.path}, childProcessHandler);
  }

  function childProcessHandler (error, message) {
    var msg = message.length ? message : error.message;
    var nt;

    if (B.showNotification) {
      if (error) {
        nt = notification.newNotification('Во время таска произошла ошибка!', {
          body: msg
        });
      } else {
        nt = notification.newNotification('Таск выполнен успешно!');
      }

      nt.onclick = function () {
        window.WIN.focus();
      };
    }

    stopLoader();

    B.messages += '\n' + msg;
    $scope.$digest();
  }

  function startLoader () {
    var id = 0;
    var loader = "\\|/—";

    interval = $interval(function() {
      B.loader = + id < 4 ? loader[id] : loader[0];
      id = id + 1 === 4 ? 0 : id + 1;
    }, 42);
  }

  function stopLoader() {
    $interval.cancel(interval);
    B.loader = "";
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