<?php
/**
 * Authentication Configuration
 *
 * IMPORTANT: Change these credentials before deploying to production!
 */

// Session configuration
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 0); // Set to 1 if using HTTPS

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Admin credentials
// Username: admin
// Default password: admin123
// Password hash generated with: password_hash('admin123', PASSWORD_DEFAULT)
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD_HASH', '$2y$10$LKFW91ak7.L99IOlqth89Oe5z.GVrw12ivNaE1hNv2FtJwy48B64e');

/**
 * Verify login credentials
 * @param string $username
 * @param string $password
 * @return bool
 */
function verifyLogin($username, $password) {
    if ($username !== ADMIN_USERNAME) {
        return false;
    }

    return password_verify($password, ADMIN_PASSWORD_HASH);
}

/**
 * Check if user is logged in
 * @return bool
 */
function isLoggedIn() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

/**
 * Require authentication - redirect to login if not logged in
 */
function requireAuth() {
    if (!isLoggedIn()) {
        header('Location: login.php');
        exit();
    }
}

/**
 * Login user
 */
function loginUser() {
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_username'] = ADMIN_USERNAME;
    $_SESSION['login_time'] = time();

    // Regenerate session ID to prevent session fixation
    session_regenerate_id(true);
}

/**
 * Logout user
 */
function logoutUser() {
    // Unset all session variables
    $_SESSION = array();

    // Destroy the session cookie
    if (isset($_COOKIE[session_name()])) {
        setcookie(session_name(), '', time() - 3600, '/');
    }

    // Destroy the session
    session_destroy();
}

/**
 * Generate password hash (for creating new passwords)
 * Usage: echo generatePasswordHash('your-password');
 * @param string $password
 * @return string
 */
function generatePasswordHash($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}
