"use strict";

var angular = require('angular');
var fs = require('fs');

var App = angular.module('app.gulp-parser', []);

App.factory('gulpParser', gulpParser);

gulpParser.$inject = [];

function gulpParser() {
  return {
    hasGulp: hasGulp,
    getTasks: getTasks
  };

  function hasGulp(path) {
    try {
      fs.readFileSync(path + '\\gulpfile.js');
    } catch (error) {
      console.log(error);
      return false;
    }

    return true;
  }

  function getTasks(path) {
    var myRegexp = /(?:gulp.task\(')(.*?)(?:',)/g;
    var gulpfile = "";
    var tasks = [];
    var match = true;

    try {
      gulpfile = fs.readFileSync(path + '\\gulpfile.js', 'utf8');
    } catch (error) {
      console.log(error);
      return tasks;
    }

    while (match != null) {
      match = myRegexp.exec(gulpfile);

      if(match) {
        tasks.push(match[1]);
      }
    }

    tasks = tasks.sort();

   return tasks
  }

}