<?php	
	header("Access-Control-Allow-Origin: *"); // Any origin is allowed
	header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Methods allowed
	header("Access-Control-Allow-Headers: Content-Type"); // Headers allowed
	//I use this to avoid CORS problems
	$dni = $_POST["carrito"];
	header('Content-Type: application/json');
	echo json_encode("ok");

?>