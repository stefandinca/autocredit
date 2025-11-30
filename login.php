<?php
/**
 * Admin Login Page
 */
require_once 'auth-config.php';

$error = '';
$success = '';

// Check if user just logged out
if (isset($_GET['logged_out'])) {
    $success = 'V-ați deconectat cu succes';
}

// If already logged in, redirect to admin panel
if (isLoggedIn()) {
    header('Location: admin.php');
    exit();
}

// Handle login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($username) || empty($password)) {
        $error = 'Vă rugăm să completați toate câmpurile';
    } elseif (verifyLogin($username, $password)) {
        loginUser();
        header('Location: admin.php');
        exit();
    } else {
        $error = 'Nume de utilizator sau parolă incorectă';
        // Add a small delay to prevent brute force attacks
        sleep(1);
    }
}
?>
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Admin Panel</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Inter', 'sans-serif'] },
                    colors: {
                        primary: { 50: '#f0f4ff', 100: '#d9e2ff', 200: '#b4c7ff', 300: '#8ea8ff', 400: '#6788ff', 500: '#4169ff', 600: '#0A1128', 700: '#080d1f', 800: '#060916', 900: '#03040b' },
                        accent: { 50: '#fff4ed', 100: '#ffe6d5', 200: '#fec9aa', 300: '#fea574', 400: '#fe7a3c', 500: '#FF6B35', 600: '#f24d16', 700: '#c73b0c', 800: '#9e3112', 900: '#7f2b12' }
                    }
                }
            }
        }
    </script>
    <style>
        .hero-gradient {
            background: linear-gradient(135deg, #0A1128 0%, #1a2b5f 100%);
        }
    </style>
</head>
<body class="bg-gray-50 font-sans antialiased">

    <div class="min-h-screen flex items-center justify-center px-4 py-12">
        <div class="max-w-md w-full">
            <!-- Logo -->
            <div class="text-center mb-8">
                <a href="index.html" class="inline-flex items-center space-x-2 group">
                    <div class="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center group-hover:bg-accent-500 transition duration-300">
                        <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span class="text-2xl font-black tracking-tight">AUTO<span class="text-accent-500">CREDIT</span></span>
                </a>
                <h1 class="mt-6 text-3xl font-black text-gray-900">Admin Panel</h1>
                <p class="mt-2 text-gray-600">Autentifică-te pentru a continua</p>
            </div>

            <!-- Login Form -->
            <div class="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <?php if ($error): ?>
                    <div class="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <div class="flex items-center">
                            <svg class="w-5 h-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p class="text-red-700 font-semibold"><?php echo htmlspecialchars($error); ?></p>
                        </div>
                    </div>
                <?php endif; ?>

                <?php if ($success): ?>
                    <div class="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                        <div class="flex items-center">
                            <svg class="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p class="text-green-700 font-semibold"><?php echo htmlspecialchars($success); ?></p>
                        </div>
                    </div>
                <?php endif; ?>

                <form method="POST" action="" class="space-y-6">
                    <div>
                        <label for="username" class="block text-sm font-bold text-gray-700 mb-2">
                            Nume utilizator
                        </label>
                        <input type="text"
                               id="username"
                               name="username"
                               required
                               autocomplete="username"
                               class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-600 focus:outline-none transition"
                               placeholder="admin">
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-bold text-gray-700 mb-2">
                            Parolă
                        </label>
                        <input type="password"
                               id="password"
                               name="password"
                               required
                               autocomplete="current-password"
                               class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-600 focus:outline-none transition"
                               placeholder="••••••••">
                    </div>

                    <button type="submit"
                            class="w-full bg-accent-500 text-white px-6 py-3 rounded-lg hover:bg-accent-600 transition font-bold shadow-lg shadow-accent-500/30">
                        Autentificare
                    </button>
                </form>

                <div class="mt-6 text-center">
                    <a href="index.html" class="text-sm text-gray-600 hover:text-primary-600 transition">
                        ← Înapoi la site
                    </a>
                </div>
            </div>

            <!-- Default Credentials Info (Remove in production!) -->
            <div class="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p class="text-sm text-yellow-800 font-semibold mb-2">⚠️ Credențiale implicite:</p>
                <p class="text-sm text-yellow-700">Username: <code class="bg-yellow-100 px-2 py-1 rounded font-mono">admin</code></p>
                <p class="text-sm text-yellow-700">Password: <code class="bg-yellow-100 px-2 py-1 rounded font-mono">admin123</code></p>
                <p class="text-xs text-yellow-600 mt-2">Schimbă parola în auth-config.php înainte de a pune site-ul în producție!</p>
            </div>
        </div>
    </div>

</body>
</html>
