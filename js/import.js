function importSVNData() {
  // Load svn list
  // TODO: Make this happen when app loads
  var BASE_SVN_URL = "https://subversion.ews.illinois.edu/svn/sp14-cs242/bsdorn2/";
  var SVN_USER_ROOT = "/bsdorn2/";
  listj = get_json("data/svn_list.xml");
  logj = get_json("data/svn_log.xml");

  // Struct factories
  var Project = makeStruct("id,title,date,version,author,files,comments");
  var Comment = makeStruct("id,content,author,date");
  var File = makeStruct("name,size,type,path,url,versions,version,author,commitmsg,date,linkname,id,comments,penid");
  var Version = makeStruct("date,number,author,msg");

  // Create array of 'Project' objects
  var project_comments = [];
  var projects = [];
  var project_names = [];
  var project_id = 0;
  for( var i = 0; i < listj.lists.list.entry.length ; i++ ) {
    // Retrieve params
    var kind = listj.lists.list.entry[i]['@attributes']['kind'];
    var name = listj.lists.list.entry[i]['name']['#text'];
    var date = listj.lists.list.entry[i]['commit']['date']['#text'];
    var version = listj.lists.list.entry[i]['commit']['@attributes']['revision'];
    var author = listj.lists.list.entry[i]['commit']['author']['#text'];
    var files = [];

    // Get name up until the first subdirectory
    if(name.indexOf("/") >= 0) {
      name = name.slice(0, name.indexOf("/"));
    }
    // Add new project if it doesn't already exist
    if(jQuery.inArray(name, project_names) == -1) {
      var new_project = new Project(String(project_id), name, date, version, author, files, project_comments);
      projects.push(new_project);
      project_names.push(name);
      project_id += 1;
    }
  } 

  // Get info for files from svn_list
  for( i = 0; i < listj.lists.list.entry.length ; i++ ) {
    // Retrieve params from files, ignore directories
    var check = listj.lists.list.entry[i]['size'];
    if(check) {
      var name = listj.lists.list.entry[i]['name']['#text'];
      var date = listj.lists.list.entry[i]['commit']['date']['#text'];
      var version = listj.lists.list.entry[i]['commit']['@attributes']['revision'];
      var author = listj.lists.list.entry[i]['commit']['author']['#text'];
      var size = check['#text'];
      var file_comments = [];

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
      var new_file = new File(actual_name,size, "", name, BASE_SVN_URL+name, versions, version, author, "", date, "#"+i, i, file_comments,"penis"+i);
      projects[proj_idx].files.push(new_file);
    }
  }

  // Sort files by name
  for( i = 0; i < projects.length ; i++ ) {
    projects[i].files.sort(compareNames);
  }

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
      var file_path = paths[j].replace(SVN_USER_ROOT,"");
      project_name = file_path.slice(0, file_path.indexOf("/"));
      var project_idx = project_names.indexOf(project_name);
      if(project_idx != -1) { // Ignore what we don't care about
        // Find file in accordion
        for( var k = 0; k < projects[project_idx].files.length; k++ ) {
          if(file_path == projects[project_idx].files[k].path) {
            var new_version = new Version(date,version,author,msg);
            projects[project_idx].files[k].versions.push(new_version);
            var filetype = paths[j].substr(paths[j].lastIndexOf('.') + 1);
            projects[project_idx].files[k].type = filetype;
            projects[project_idx].files[k].commitmsg = msg;
          }
        }
      }
    }
  }

  return projects; 
}