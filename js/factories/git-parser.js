"use strict";

var angular = require('angular');
var fs = require('fs');

var App = angular.module('app.git-parser', []);

var GIT_PATH = '\\.git';
var GIT_IGNORE_FILE = '\\.gitignore';
var GIT_EXCLUDE_FILE = GIT_PATH + '\\info\\exclude';

App.factory('gitParser', gitParser);

gitParser.$inject = [];

function gitParser() {
  return {
    hasGit: hasGit,
    getGitIgnore: getGitIgnore,
    setGitIgnore: setGitIgnore,
    getGitExclude: getGitExclude,
    setGitExclude: setGitExclude
  };

  function hasGit(path) {
    try {
      fs.readdirSync(path + GIT_PATH);
    } catch (error) {
      console.log(error);
      return false;
    }

    return true;
  }

  function getGitIgnore(path) {
    var gitignore = "";

    try {
      gitignore = fs.readFileSync(path + GIT_IGNORE_FILE);
    } catch (error) {
      console.log(error);
      return null;
    }

    return gitignore;
  }

  function setGitIgnore(path, gitirnore) {
    fs.writeFileSync(path + GIT_IGNORE_FILE, gitirnore);
  }

  function getGitExclude(path) {
    var exclude = "";

    try {
      exclude = fs.readFileSync(path + GIT_EXCLUDE_FILE);
    } catch (error) {
      console.log(error);
      return null;
    }

    return exclude;
  }

  function setGitExclude(path, exclude) {
    fs.writeFileSync(path + GIT_EXCLUDE_FILE, exclude);
  }
}