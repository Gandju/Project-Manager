"use strict";

var angular = require('angular');
var _ = require('lodash');

var App = angular.module('app.notification', []);


App.factory('notification', notification);

notification.$inject = [];

function notification() {
  return {
    newNotification: newNotification
  };

  function newNotification(title, data) {
    return new window.Notification(title, _.extend({lang: 'ru'}, data));
  }
}