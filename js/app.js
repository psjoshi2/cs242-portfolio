// Create new ember app
App = Ember.Application.create({});

// Get SVN data
projects = Ember.A($.makeArray(setupDB()));

// Routing
App.Router.map(function() {
  this.resource('home', { path: '/' });
  this.resource('about');
  this.resource('projects' , function() {
    this.resource('project', { path: ':project_id' });
  });
});

App.ProjectsRoute = Ember.Route.extend({
  model: function() {
    return projects;
  }
});
App.ProjectRoute = Ember.Route.extend({
  model: function(params) {
    return projects.findBy('id', params.project_id);
  }
});

var showdown = new Showdown.converter();

Ember.Handlebars.helper('format-markdown', function(input) {
  return new Handlebars.SafeString(showdown.makeHtml(input));
});

Ember.Handlebars.helper('format-date', function(date) {
  return moment(date).fromNow();
});

Ember.Handlebars.helper('format-date-specific', function(date) {
  return moment(date).calendar();
});
