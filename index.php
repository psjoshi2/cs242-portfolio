<?php
exec('svn list --xml --recursive https://subversion.ews.illinois.edu/svn/sp14-cs242/bsdorn2 > data/svn_list.xml'); exec('svn log --verbose --xml https://subversion.ews.illinois.edu/svn/sp14-cs242/bsdorn2 > data/svn_log.xml');
include_once("index.html");
$interval=60; //minutes
set_time_limit(0);
while (true)
{
  $now=time();
  include("php/svn.php");
  sleep($interval*60-(time()-$now));
}
?>