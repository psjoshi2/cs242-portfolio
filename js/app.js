// Struct factory, takes in params for struct and returns constructor
function makeStruct(params) {
  var params = params.split(',');
  var num_params = params.length;
  function Object() {
    for (var i = 0; i < num_params; i++) {
      this[params[i]] = arguments[i];
    }
  }
  return Object;
}

// Changes XML to JSON - Taken from http://davidwalsh.name/convert-xml-json
function xmlToJson(xml) {
  
  // Create the return object
  var obj = {};

  if (xml.nodeType == 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
    obj["@attributes"] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) { // text
    obj = xml.nodeValue;
  }

  // do children
  if (xml.hasChildNodes()) {
    for(var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof(obj[nodeName]) == "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof(obj[nodeName].push) == "undefined") {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
};

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
var lj = xmlToJson(list);
// console.log(lj.lists.list.entry[0]);
// console.log("Author: "+lj.lists.list.entry[0]['commit']['author']['#text']);
// console.log("Date: "+lj.lists.list.entry[0]['commit']['date']['#text']);
// console.log("Revision #: "+lj.lists.list.entry[0]['commit']['@attributes']['revision']);
// console.log("Name: "+lj.lists.list.entry[0]['name']['#text']);
// console.log(lj.lists.list.entry[0]['@attributes']['kind']);

// Create array of 'Project' objects
//  - Title
//  - Date
//  - Version
//  - Summary
//  - Author = netID
var Project = makeStruct("id,title,date,version,author");

var projects = [];
var project_names = [];
var project_id = 0;
for( var i = 0; ; i++ )
{
  // Check if done
  if(!lj.lists.list.entry[i]) break;

  // Retrieve params
  var kind = lj.lists.list.entry[i]['@attributes']['kind'];
  var name = lj.lists.list.entry[i]['name']['#text'];
  var date = lj.lists.list.entry[i]['commit']['date']['#text'];
  var version = lj.lists.list.entry[i]['commit']['@attributes']['revision'];
  var author = lj.lists.list.entry[i]['commit']['author']['#text'];
  
  if(name.indexOf("/") >= 0)
  {
    name = name.slice(0, name.indexOf("/"));
  }
  if(jQuery.inArray(name, project_names) == -1)
  {
    console.log("made it");
    var new_project = new Project(String(project_id), name, date, version, author);
    //console.log(new_project);
    projects.push(new_project);
    project_names.push(name);
    project_id += 1;
  }
}

// console.log(projects);

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
var File = makeStruct("size, type, path, content, versions, version, author, commitmsg, date");


// var test = [{
//   id: '1',
//   title: "Rails is Omakase",
//   author: "Bryce Dorn",
//   date: new Date('12-27-2012'),
//   excerpt: "There are lots of à la carte software environments in this world. Places where in order to eat, you must first carefully look over the menu of options to order exactly what you want.",
//   body: "I want this for my ORM, I want that for my template language, and let's finish it off with this routing library. Of course, you're going to have to know what you want, and you'll rarely have your horizon expanded if you always order the same thing, but there it is. It's a very popular way of consuming software.\n\nRails is not that. Rails is omakase."
// }, {
//   id: '2',
//   title: "The Parley Letter",
//   author: { name: "d2h" },
//   date: new Date('12-24-2012'),
//   excerpt: "My [appearance on the Ruby Rogues podcast](http://rubyrogues.com/056-rr-david-heinemeier-hansson/) recently came up for discussion again on the private Parley mailing list.",
//   body: "A long list of topics were raised and I took a time to ramble at large about all of them at once. Apologies for not taking the time to be more succinct, but at least each topic has a header so you can skip stuff you don't care about.\n\n### Maintainability\n\nIt's simply not true to say that I don't care about maintainability. I still work on the oldest Rails app in the world."  
// }];
// console.log(test);

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

// var showdown = new Showdown.converter();

// Ember.Handlebars.helper('format-markdown', function(input) {
//   return new Handlebars.SafeString(showdown.makeHtml(input));
// });

// Ember.Handlebars.helper('format-date', function(date) {
//   return moment(date).fromNow();
// });
