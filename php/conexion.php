<?php
$link = mysqli_connect("localhost", "root", "root");//My db has password
mysqli_select_db( $link,"virtualmarket");
$tildes = $link->query("SET NAMES 'UTF8'");

?>