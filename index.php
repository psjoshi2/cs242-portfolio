<?php
include_once("index.html");
$interval=60; //minutes
set_time_limit(0);
while (true)
{
  $now=time();
  include("svn.php");
  sleep($interval*60-(time()-$now));
}
?>