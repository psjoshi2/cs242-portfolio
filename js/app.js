// Create new ember app
App = Ember.Application.create({});

// Load svn list
// TODO: Make this happen when app loads
var BASE_SVN_URL = "https://subversion.ews.illinois.edu/svn/sp14-cs242/bsdorn2/";
listj = get_json("data/svn_list.xml");
logj = get_json("data/svn_log.xml");

// Create array of 'Project' objects
// Project:
//  - Title
//  - Date
//  - Version
//  - Summary
//  - Author = netID
var Project = makeStruct("id,title,date,version,author,files");

var projects = [];
var project_names = [];
var project_id = 0;
for( var i = 0; i < listj.lists.list.entry.length ; i++ )
{
  // Retrieve params
  var kind = listj.lists.list.entry[i]['@attributes']['kind'];
  var name = listj.lists.list.entry[i]['name']['#text'];
  var date = listj.lists.list.entry[i]['commit']['date']['#text'];
  var version = listj.lists.list.entry[i]['commit']['@attributes']['revision'];
  var author = listj.lists.list.entry[i]['commit']['author']['#text'];
  var files = [];

  if(name.indexOf("/") >= 0) {
    name = name.slice(0, name.indexOf("/"));
  }
  if(jQuery.inArray(name, project_names) == -1) {
    var new_project = new Project(String(project_id), name, date, version, author, files);
    //console.log(new_project);
    projects.push(new_project);
    project_names.push(name);
    project_id += 1;
  }
} // console.log(projects);

// Each project should have array of File objects
// File:
//  - Type
//  - Path
//  - URL to File on SVN
//  - Each version of the file
//    * Number = revision number for commit
//    * Author = netID
//    * Info = commit msg
//    * Date of commmit
var File = makeStruct("name,size,type,path,url,versions,version,author,commitmsg,date,linkname,id");
var Version = makeStruct("date,number,author,msg");

// Get info for files from svn_list
for( i = 0; i < listj.lists.list.entry.length ; i++ ) {
  // Retrieve params only from files, not directories
  var check = listj.lists.list.entry[i]['size'];
  if(check) {
    var name = listj.lists.list.entry[i]['name']['#text'];
    var date = listj.lists.list.entry[i]['commit']['date']['#text'];
    var version = listj.lists.list.entry[i]['commit']['@attributes']['revision'];
    var author = listj.lists.list.entry[i]['commit']['author']['#text'];
    var size = check['#text'];

    // Add new file
    for( var l = 0; l < project_names.length; l++ ) {
      if(name.indexOf("/") >= 0) {
        temp_name = name.slice(0, name.indexOf("/"));
      } else temp_name = name;
      if(project_names[l] == temp_name) {
        var proj_idx = l;
      }
    }

    var actual_name = reverse(name);
    actual_name = actual_name.slice(0,actual_name.indexOf("/"));
    actual_name = reverse(actual_name);

    var versions = [];
    var new_file = new File(actual_name,size,"",name,BASE_SVN_URL+name,versions,version,author,"",date,"#"+i,i);
    projects[proj_idx].files.push(new_file);
  }
} // console.log(projects);

// Get info for files from svn_log
for( i = 0; i < logj.log.logentry.length ; i++ ) {
  // Retrieve params
  var kind = logj.log.logentry[i]['@attributes']['kind'];    
  var date = logj.log.logentry[i]['date']['#text'];
  var version = logj.log.logentry[i]['@attributes']['revision'];
  var author = logj.log.logentry[i]['author']['#text'];
  var msg = logj.log.logentry[i]['msg']['#text'];
  var paths = [];

  // Get path to each file
  for( var j = 0; j < logj.log.logentry[i].paths.path.length; j++ ) {
    // Make sure we're only getting files
    if(logj.log.logentry[i].paths.path[j]['@attributes']['kind'] == "file") {
      paths.push(logj.log.logentry[i].paths.path[j]['#text'])
    }
  }

  // Update each file
  for( j = 0; j < paths.length; j++ ) {
    var file_path = paths[j].replace("/bsdorn2/","");
    project_name = file_path.slice(0, file_path.indexOf("/"));
    var project_idx = project_names.indexOf(project_name);
    if(project_idx != -1) { // Ignore what we don't care about
      // Find file in accordion
      for( var k = 0; k < projects[project_idx].files.length; k++ ) {
        // console.log(projects[project_idx].files[k]);
        if(file_path == projects[project_idx].files[k].path) {
          // console.log(file_path+" is the same as "+ projects[project_idx].files[k].path);
          var new_version = new Version(date,version,author,msg);
          projects[project_idx].files[k].versions.push(new_version);
          var filetype = paths[j].substr(paths[j].lastIndexOf('.') + 1);
          projects[project_idx].files[k].type = filetype;
          // console.log(projects[project_idx].files[k].commitmsg);
          projects[project_idx].files[k].commitmsg = msg;
        }
      }
    }
  }
} 
// Convert to Ember array
projects = Ember.A($.makeArray(projects));
console.log(projects[0]);

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
