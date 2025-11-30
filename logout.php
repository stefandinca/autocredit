<?php
/**
 * Logout Handler
 */
require_once 'auth-config.php';

// Logout the user
logoutUser();

// Redirect to login page with success message
header('Location: login.php?logged_out=1');
exit();
