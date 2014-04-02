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

// Coincides with PHP script that's run every hour
var woot = setInterval(updateDB(projects), 600);

function updateDB(p) {
  console.log("UPDATING DB...");
  // Store comments
  var projectComments = [];
  var fileComments = [];
  var commentBackup = makeStruct("comment,proj_idx,file_idx");
  
  // Project comments
  for(var i = 0; i < p.length; i++) {
    for(var l = 0; l < p[i].comments.length; l++) {
      var new_backup = new commentBackup(p[i].comments[l],i,-1);
      projectComments.push(new_backup);
    }

    // File comments
    for(var k = 0; k < p[i].files.length; k++) {
      for(l = 0; l < p[i].files[k].comments.length; l++) {
        var new_backup = new commentBackup(p[i].files[k].comments[l],i,k);
        projectComments.push(new_backup);
      }
    }
  }



  // Refresh and restore
  p = Ember.A($.makeArray(setupDB()));
  applyComments(p,projectComments,fileComments);
  console.log("UPDATE COMPLETE! "+commentBackup.length+" COMMENTS RESTORED.");
  console.log(p);
}

function applyComments(p,j,f) {
  var f_idx = 0;
  var p_idx = 0;

  // Project comments
  for(var i = 0; i < j.length; i++) {
    p_idx = j[i].project_idx;
    projects[p_idx].comments.pushObject(j[i].comment);
  }

  // File comments
  for(i = 0; i < f.length; i++) {
    p_idx = f[i].project_idx;
    f_idx = f[i].file_idx;
    projects[p_idx].files[file_idx].comments.pushObject(f[i].comment);
  }
}

// App.Persist = Ember.ArrayController.create({
//   content: projects,
//   save: function () {
//     // assuming you are using jQuery, but could be other AJAX/DOM framework
//     $.post({
//       url: "/",
//       data: JSON.stringify( this.toArray() ),
//       success: function ( data ) {
//         // your data should already be rendered with latest changes
//         // however, you might want to change status from something to "saved" etc.
//         console.log("Saved!");
//       }
//     });
//   }
// });