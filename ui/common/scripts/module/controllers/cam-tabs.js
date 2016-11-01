'use strict';

var angular = require('camunda-commons-ui/vendor/angular');

module.exports = ['$scope', 'search', 'Views', CamTabs];

function CamTabs($scope, search, Views) {
  this.providers = Views.getProviders($scope.providerParams);
  this.selected = this.providers[0];
  this.search = search;

  this.vars = {
    read: ['tabsApi']
  };

  $scope.$on('$locationChangeSuccess', this.onLocationChange.bind(this));
  this.onLocationChange();
}

CamTabs.prototype.onLocationChange = function() {
  var params = this.search();

  if (this.isTabSelectionChangedInUrl(params)) {
    this.selected = this.providers.filter(function(provider) {
      return provider.id === params.tab;
    })[0];
  }
};

CamTabs.prototype.isTabSelectionChangedInUrl = function(params) {
  return angular.isString(params.tab) && (!this.selected || params.tab !== this.selected.id);
};

CamTabs.prototype.selectTab = function(tabProvider) {
  var params = this.search();
  var tabParams = {
    tab: tabProvider.id
  };

  this.selected = tabProvider;

  this.search.updateSilently(angular.extend(params, tabParams));
};

CamTabs.prototype.isSelected = function(tabProvider) {
  return this.selected === tabProvider;
};
