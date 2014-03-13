// QUnit Testing suite
var testJson = 
{
  "name" : "TestProject",
  "date" : "DayAfterTomorrow",
  "size" : "69",

  "files" : [
    {
      "name" : "TestFile",
      "versions" : [
        {
          "number" : "first",
          "author" : "NotMe"
        }
      ]
    }
  ]
};

test( "should initialize Project name correctly", function() {
  ok( testJson.name == "TestProject", "Passed!" );
});
test( "should initialize Project date correctly", function() {
  ok( testJson.date == "DayAfterTomorrow", "Passed!" );
});
test( "should initialize Project size correctly", function() {
  ok( testJson.size == "69", "Passed!" );
});

test( "should initialize Project file array correctly", function() {
  ok( testJson.files.length == "1", "Passed!" );
});
test( "should initialize Project files correctly", function() {
  ok( testJson.files[0].name == "TestFile", "Passed!" );
});

test( "should initialize Project file versions array correctly", function() {
  ok( testJson.files[0].versions.length == "1", "Passed!" );
});
test( "should initialize Project file version correctly", function() {
  ok( testJson.files[0].versions[0].number == "first", "Passed!" );
});

var fileString = "https://subversion.ews.illinois.edu/svn/sp14-cs242/bsdorn2/Assignment1.0/src/Game.java"
var fileType = reverse(fileString);
fileType = reverse(fileType.slice(0,fileType.indexOf(".")+1));

test( "should extract filetype correctly", function() {
  ok( fileType == ".java", "Passed!" );
});