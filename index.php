<?php
// exec('svn list --xml --recursive https://subversion.ews.illinois.edu/svn/sp14-cs242/bsdorn2 > data/svn_list.xml'); exec('svn log --verbose --xml https://subversion.ews.illinois.edu/svn/sp14-cs242/bsdorn2 > data/svn_log.xml');
// echo("<script>console.log('Hello World!');</script>");
echo "Should echo regardless.";

include_once("index.html");
if ($_GET['run']) {
  # This code will run if ?run=true is set.
  echo "Button was clicked.";  
}
// $interval=60; //minutes
// set_time_limit(0);
// while (true)
// {
//   $now=time();
//   include("php/svn.php");
//   sleep($interval*60-(time()-$now));
// }
// if($_GET['run']){
//   echo("<script>console.log('Hello World!');</script>");
// }
?>