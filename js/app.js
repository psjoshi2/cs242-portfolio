// Create new ember app
App = Ember.Application.create({});

// Load svn list
// TODO: Make this happen when app loads
// $.ajax({
//   type: "GET",
//   url: "jquery_xml.xml",
//   dataType: "xml",
//   success: parseXml
// });
var list = loadXMLDoc("data/svn_list.xml");
console.log(list);

// Find unique projects
// find_by(list,"author");
function find_by(xml,name) 
{
  $(xml).find(name).each(function()
  {
    console.log($(this).context.innerHTML);
  });
}

// For each project, make entry in array
var project_names = [];
$(list).find("name").each(function()
{
  var name = String( $(this).context.innerHTML );
  
  console.log(jQuery.type(name));
  name_chomped = name.slice(0, name.indexOf("/"));
  if(jQuery.inArray(name_chomped, project_names) == -1)
  {
    project_names.push(name_chomped);
  }
});

// console.log(project_names);

// Array of 'project' objects
//  - Title
//  - Date
//  - Version
//  - Summary
//  
// var projects_s [];
// $(project_names).each(function()
// {
//   var id = array_index
//   var title = 
//   var author = netID
//   var date = 
//   var 
// });

// Each project should have array of 'file' objects
// File
//  - Type
//  - Path
//  - File itself?
//  - Each version of the file
//    * Number = revision number for commit
//    * Author = netID
//    * Info = commit msg
//    * Date of commmit


var projects = [{
  id: '1',
  title: "Rails is Omakase",
  author: "Bryce Dorn",
  date: new Date('12-27-2012'),
  excerpt: "There are lots of à la carte software environments in this world. Places where in order to eat, you must first carefully look over the menu of options to order exactly what you want.",
  body: "I want this for my ORM, I want that for my template language, and let's finish it off with this routing library. Of course, you're going to have to know what you want, and you'll rarely have your horizon expanded if you always order the same thing, but there it is. It's a very popular way of consuming software.\n\nRails is not that. Rails is omakase."
}, {
  id: '2',
  title: "The Parley Letter",
  author: { name: "d2h" },
  date: new Date('12-24-2012'),
  excerpt: "My [appearance on the Ruby Rogues podcast](http://rubyrogues.com/056-rr-david-heinemeier-hansson/) recently came up for discussion again on the private Parley mailing list.",
  body: "A long list of topics were raised and I took a time to ramble at large about all of them at once. Apologies for not taking the time to be more succinct, but at least each topic has a header so you can skip stuff you don't care about.\n\n### Maintainability\n\nIt's simply not true to say that I don't care about maintainability. I still work on the oldest Rails app in the world."  
}];


App.Router.map(function() {
  this.resource('about');
  this.resource('projects', function() {
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
