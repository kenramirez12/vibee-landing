<?php

$servername = "localhost";
$username = "rtrgdnra_vibeeadmin";
$password = "v1B3*_abc";
$dbname = "rtrgdnra_vibee";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 