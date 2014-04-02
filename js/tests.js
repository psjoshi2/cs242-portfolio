// QUnit Testing suite
// 
// MODEL TESTING
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
      ],
      "comments" : [
        {
          "content" : "This is what I am commenting on the file",
          "author" : "FileCommenter"
        }
      ]
    }
  ],
  "comments" : [
    {
      "content" : "This is what I am commenting on the project",
      "author" : "ProjectCommenter"
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

test( "should initialize File Comments correctly", function() {
  ok( testJson.files[0].comments.length == 1, "Passed!" );
});

test( "should initialize File Comments Author correctly", function() {
  ok( testJson.files[0].comments[0].author == "FileCommenter", "Passed!" );
});

test( "should initialize File Comment content correctly", function() {
  ok( testJson.files[0].comments[0].content == "This is what I am commenting on the file", "Passed!" );
});

test( "should initialize Project Comments correctly", function() {
  ok( testJson.comments.length == 1, "Passed!" );
});

test( "should initialize Project Comments Author correctly", function() {
  ok( testJson.comments[0].author == "ProjectCommenter", "Passed!" );
});

test( "should initialize Project Comment content correctly", function() {
  ok( testJson.comments[0].content == "This is what I am commenting on the project", "Passed!" );
});

// AUXILIARY FXN TESTING
var fileString = "https://subversion.ews.illinois.edu/svn/sp14-cs242/bsdorn2/Assignment1.0/src/Game.java"
var fileType = reverse(fileString);
fileType = reverse(fileType.slice(0,fileType.indexOf(".")+1));

test( "should extract filetype correctly", function() {
  ok( fileType == ".java", "Passed!" );
});

var email = "thisismyemail@email.com";
var dirty_email = "this#^sisnt.?anem@ail.%@#$.com";

test( "should be an invalid email", function() {
  ok( checkEmail(dirty_email) == false, "Passed!" );
});

test( "should sanitize email", function() {
  ok( !checkEmail(dirty_email), "Passed!" );
});

test( "should get gravatar email", function() {
  ok( gravatarSimple(email) == 'http://www.gravatar.com/avatar/'+hex_md5(email)+'.jpg', "Passed!" );
});

var t = "tamba";
test( "should reverse string correctly", function() {
  ok( reverse(t) == "abmat", "Passed!" );
});

// DEPLOYMENT TESTING
// test( "should have working site", function() {
  // ok( htmlresponse(url) == 1, "Passed!" );
// });

// ROUTE TESTING?