"use strict";

var angular = require('angular');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
require('angular-local-storage');

var App = angular.module('app.projects', ['LocalStorageModule']);

App.factory('projects', projects);

projects.$inject = ['$http', '$q', 'localStorageService'];

function projects($http, $q, localStorageService) {
  return {
    addProject: addProject,
    removeProject: removeProject,
    getProjects: getProjects,
    getProject: getProject,
    getPackage: getPackage,
    setPackage: setPackage,
    createPackage: createPackage
  };

  function addProject(_p) {
    return $q(promise);

    function promise (resolve, reject) {
      var p = '';
      var projects = getProjects() || [];

      if (_.findWhere(projects, {path: _p})) {
        reject('Проект уже добавлен!');
        return;
      }

      try {
        fs.readdirSync(_p);
      } catch (error) {
        console.warn(error);
        reject('Путь не найден!');
        return;
      }

      p = path.normalize(_p);
      var packageUrl = path.join(p + '/package.json');

      $http.get(packageUrl)
        .success(successCallback)
        .error(errorCallback);

      function successCallback (data) {
        var projects = getProjects() || [];
        var project = {
          name: data.name.toUpperCase(),
          description: data.description,
          version: data.version,
          author: data.author,
          repository: data.repository,
          path: p,
          packageUrl: packageUrl
        };

        projects.push(project);

        setProjects(projects);

        resolve(project);
      }

      function errorCallback () {
        var projects = getProjects() || [];
        var project = {
          name: p.slice(p.lastIndexOf('\\') + 1, p.length - 1),
          description: null,
          version: '0.0.1',
          author: null,
          repository: null,
          path: p,
          packageUrl: packageUrl
        };

        projects.push(project);

        setProjects(projects);

        resolve(project);
      }
    }
  }

  function removeProject(name, version) {
    var projects = getProjects() || [];
    _.remove(projects, {name: name, version: version});

    setProjects(projects);
    return projects;
  }

  function getProjects() {
    return localStorageService.get('projects')
  }

  function setProjects(projects) {
    return localStorageService.set('projects', projects)
  }

  function getProject(name, version) {
    var projects = getProjects();

    return _.findWhere(projects, {name: name, version: version});
  }

  function getPackage(path) {
    try {
      return fs.readFileSync(path, 'utf8');
    } catch (error) {
      console.warn(error);
      return null;
    }
  }

  function setPackage(path, pckg) {
    fs.writeFileSync(path, pckg);
  }

  function createPackage(path, name) {
    var pckg =
      "{\n"+
      "  \"name\": \"" + name + "\",\n" +
      "  \"description\": \"\",\n" +
      "  \"version\": \"0.0.1\",\n" +
      "  \"keywords\": [],\n" +
      "  \"author\": {\n" +
      "    \"name\": \"\",\n" +
      "    \"email\": \"\"\n" +
      "  },\n" +
      "  \"homepage\": \"\",\n" +
      "  \"license\": \"MIT\",\n" +
      "  \"dependencies\": {}\n"+
      "}\n";

    fs.writeFileSync(path, pckg);

    return pckg;
  }
}