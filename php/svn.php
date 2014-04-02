<?php
exec('svn list --xml --recursive https://subversion.ews.illinois.edu/svn/sp14-cs242/bsdorn2 > data/svn_list.xml'); exec('svn log --verbose --xml https://subversion.ews.illinois.edu/svn/sp14-cs242/bsdorn2 > data/svn_log.xml');
?>