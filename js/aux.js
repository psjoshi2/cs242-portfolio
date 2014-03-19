// Ah.
String.prototype.repeat = function (num) {
  return new Array(num + 1).join(this);
};

function loadXMLDoc(filename) {
  if (window.XMLHttpRequest) {
    xhttp = new XMLHttpRequest();
  } else { // IE5 and IE6
    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xhttp.open("GET", filename, false);
  xhttp.send();
  return xhttp.responseXML;
}

function getJSON(path) {
  var list = loadXMLDoc(path);
  return xmlToJson(list);
}

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

// Reverses a string (useful for extracting filenames)
function reverse(s){
  return s.split("").reverse().join("");
}

// Replace naughty words with random words
function filter(div){
  $(div).profanityFilter({
      externalSwears: 'data/swears.json',
      replaceWith: ['happy', 'funny', 'lucky']
  });
}

// See if a name should be before another in a sorted array
function compareNames(a, b){
  return ((a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : ((a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : 0));
}

// Dynamically load file contents into file's iframe
function iframeIt(url,id) {
  $("iframe#"+id).css('display','block');
  $("iframe#"+id).attr("src", url);
}

// Taken from http://stackoverflow.com/questions/8398403/jquery-javascript-to-check-if-correct-e-mail-was-entered
function validateEmail(email) { 
    var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
    return pattern.test(email);
}

function gravatarSimple(email) {
  var baseUrl = 'http://www.gravatar.com/avatar/';
  return baseUrl+hex_md5(email)+'.jpg';
}

// Profanity filter, taken from http://stackoverflow.com/questions/4541070/how-can-i-do-a-jquery-swear-word-bad-word-filter
function filterWords(txt) {
  var filter = ['ass', 'words'];
  for(var i=0; i<swears.length; i++){
    var pattern = new RegExp('\\b' + swears[i] + '\\b', 'g');
    var replacement = '*'.repeat(swears[i].length);
    txt = txt.replace(pattern, replacement);
  }
  return txt;
}

// Function to add comments, button's div is passed in as argument
function addComment(div) {
  // Comment struct
  var Comment = makeStruct("id,content,author,date,subs,img");
  var subcomments = [];

  // Filter text
  var unclean = div.parent().find("textarea").val();
  content = filterWords(unclean);

  // Author is email, or nil is Anonymous
  var author = div.parent().find("input").val();
  if(!author) author = "Anonymous";  

  // Find the file in projects[] that this is commenting on (or Project that it is commenting on)
  var date = $.format.date(new Date().getTime(),"MMM dd yyyy, h:mma");
  var proj_id = div.parent().attr('id');
  var file_id = div.attr('id');

  // Gravatar? Sure
  var gravatar = gravatarSimple(author);

  if(file_id) { // File comment
    var comment_id = projects[proj_id].files[file_id].comments.length;
    var new_comment = new Comment(comment_id,content,author,date,subcomments,gravatar);
    projects[proj_id].files[file_id].comments.pushObject(new_comment);
  }
  else { // Project comment
    var comment_id = projects[proj_id].comments.length;
    var new_comment = new Comment(comment_id,content,author,date,subcomments,gravatar);
    projects[proj_id].comments.pushObject(new_comment);
  }

  // Clear fields, we don't need them anymore
  div.parent().find("textarea").val("");
  div.parent().find("input").val("");
}
