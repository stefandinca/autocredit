<?php
/**
 * Password Hash Generator
 *
 * Use this utility to generate password hashes for auth-config.php
 *
 * SECURITY WARNING: Delete this file after generating your password!
 */

$newPasswordHash = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $newPassword = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirm_password'] ?? '';

    if (empty($newPassword)) {
        $error = 'Introduceți o parolă';
    } elseif (strlen($newPassword) < 8) {
        $error = 'Parola trebuie să aibă cel puțin 8 caractere';
    } elseif ($newPassword !== $confirmPassword) {
        $error = 'Parolele nu se potrivesc';
    } else {
        $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);
    }
}
?>
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generate Password Hash</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Inter', 'sans-serif'] },
                    colors: {
                        primary: { 600: '#0A1128' },
                        accent: { 500: '#FF6B35', 600: '#f24d16' }
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-gray-50 font-sans antialiased">

    <div class="min-h-screen flex items-center justify-center px-4 py-12">
        <div class="max-w-2xl w-full">
            <div class="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <h1 class="text-3xl font-black text-gray-900 mb-2">Generate Password Hash</h1>
                <p class="text-gray-600 mb-6">Use this tool to generate a secure password hash for auth-config.php</p>

                <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
                    <p class="text-red-700 font-semibold">⚠️ IMPORTANT SECURITY WARNING</p>
                    <p class="text-red-600 text-sm mt-2">Delete this file (change-password.php) after generating your password hash!</p>
                </div>

                <?php if ($error): ?>
                    <div class="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p class="text-red-700 font-semibold"><?php echo htmlspecialchars($error); ?></p>
                    </div>
                <?php endif; ?>

                <?php if ($newPasswordHash): ?>
                    <div class="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                        <p class="text-green-700 font-semibold mb-3">✓ Password hash generated successfully!</p>
                        <p class="text-sm text-gray-700 mb-2">Copy this hash and replace ADMIN_PASSWORD_HASH in auth-config.php:</p>
                        <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs break-all">
                            <?php echo htmlspecialchars($newPasswordHash); ?>
                        </div>
                        <p class="text-sm text-gray-600 mt-4">Instructions:</p>
                        <ol class="text-sm text-gray-600 mt-2 space-y-1 list-decimal list-inside">
                            <li>Open <code class="bg-gray-100 px-2 py-1 rounded">auth-config.php</code></li>
                            <li>Find the line: <code class="bg-gray-100 px-2 py-1 rounded">define('ADMIN_PASSWORD_HASH', '...');</code></li>
                            <li>Replace the hash with the one above</li>
                            <li>Save the file</li>
                            <li><strong>Delete change-password.php</strong></li>
                        </ol>
                    </div>
                <?php else: ?>
                    <form method="POST" action="" class="space-y-6">
                        <div>
                            <label for="password" class="block text-sm font-bold text-gray-700 mb-2">
                                New Password
                            </label>
                            <input type="password"
                                   id="password"
                                   name="password"
                                   required
                                   minlength="8"
                                   class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-600 focus:outline-none transition"
                                   placeholder="Minimum 8 characters">
                        </div>

                        <div>
                            <label for="confirm_password" class="block text-sm font-bold text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <input type="password"
                                   id="confirm_password"
                                   name="confirm_password"
                                   required
                                   minlength="8"
                                   class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-600 focus:outline-none transition"
                                   placeholder="Repeat password">
                        </div>

                        <button type="submit"
                                class="w-full bg-accent-500 text-white px-6 py-3 rounded-lg hover:bg-accent-600 transition font-bold shadow-lg shadow-accent-500/30">
                            Generate Password Hash
                        </button>
                    </form>
                <?php endif; ?>

                <div class="mt-6 text-center">
                    <a href="index.html" class="text-sm text-gray-600 hover:text-primary-600 transition">
                        ← Back to home
                    </a>
                </div>
            </div>
        </div>
    </div>

</body>
</html>
