function loadXMLDoc(filename) {
  if (window.XMLHttpRequest) {
    xhttp = new XMLHttpRequest();
  } else // code for IE5 and IE6
  {
    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xhttp.open("GET", filename, false);
  xhttp.send();
  return xhttp.responseXML;
}

function get_json(path)
{
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
  $("iframe#"+id).attr("src", url);
}
