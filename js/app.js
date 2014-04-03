// Create new ember app
App = Ember.Application.create({});

// Get SVN data
var peep = setupDB();
projects = Ember.A($.makeArray(peep));

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

// Coincides with PHP script that's run every hour
setInterval(function(projects) {
  updateDB(projects);
}
, 360000);

function updateDB(p) {
  console.log(".......................................UPDATING DB.....................................");
  var p = projects;

  // Store comments
  var projectComments = Ember.A($.makeArray());
  var fileComments = Ember.A($.makeArray());
  var commentBackup = makeStruct("comment,proj_idx,file_idx");
  
  // Clear residual data - these aren't running..
  projectComments.clear();
  fileComments.clear();

  // Project comments
  for(var i = 0; i < p.length; i++) {
    for(var l = 0; l < p[i].comments.length; l++) {
      var new_backup = new commentBackup(p[i].comments[l],i,-1);
      projectComments.pushObject(new_backup);
      // console.log("Backed up "+new_backup);
    }

    // File comments
    for(var k = 0; k < p[i].files.length; k++) {
      for(l = 0; l < p[i].files[k].comments.length; l++) {
        var new_backup = new commentBackup(p[i].files[k].comments[l],i,k);
        fileComments.pushObject(new_backup);
        // console.log("Backed up "+new_backup);
      }
    }
  }

  // Refresh and restore
  p = Ember.A($.makeArray(setupDB()));
  applyComments(p,projectComments,fileComments);
  console.log(".......................UPDATE COMPLETE! "+projectComments.length+" PROJECT COMMENTS AND "+fileComments.length+" FILE COMMENTS RESTORED.");
  projects = p;
}

function applyComments(p,j,f) {
  var f_idx = 0;
  var p_idx = 0;

  // Project comments
  for(var i = 0; i < j.length; i++) {
    p_idx = j[i].proj_idx;
    p[p_idx].comments.pushObject(j[i].comment);
  }

  // File comments
  for(i = 0; i < f.length; i++) {
    p_idx = f[i].proj_idx;
    f_idx = f[i].file_idx;
    p[p_idx].files[f_idx].comments.pushObject(f[i].comment);
  }
  console.log("Applied.");
}

