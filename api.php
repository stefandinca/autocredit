<?php
/**
 * Autocredit Romania - API Endpoint
 * Handles car inventory management operations
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration
$carsFile = __DIR__ . '/data/cars.json';

// Ensure data directory exists
if (!file_exists(__DIR__ . '/data')) {
    mkdir(__DIR__ . '/data', 0755, true);
}

// Ensure cars.json exists
if (!file_exists($carsFile)) {
    file_put_contents($carsFile, '[]');
}

/**
 * Read cars from JSON file
 * @return array
 */
function getCars() {
    global $carsFile;

    if (!file_exists($carsFile)) {
        return [];
    }

    $json = file_get_contents($carsFile);
    $cars = json_decode($json, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log('JSON decode error: ' . json_last_error_msg());
        return [];
    }

    return $cars ?: [];
}

/**
 * Save cars to JSON file
 * @param array $cars
 * @return bool
 */
function saveCars($cars) {
    global $carsFile;

    $json = json_encode($cars, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

    if ($json === false) {
        error_log('JSON encode error: ' . json_last_error_msg());
        return false;
    }

    $result = file_put_contents($carsFile, $json);

    if ($result === false) {
        error_log('Failed to write to file: ' . $carsFile);
        return false;
    }

    return true;
}

/**
 * Send JSON response
 * @param mixed $data
 * @param int $statusCode
 */
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

/**
 * Send error response
 * @param string $message
 * @param int $statusCode
 */
function sendError($message, $statusCode = 400) {
    sendResponse(['error' => $message], $statusCode);
}

// Get request method and action
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'list';
$id = $_GET['id'] ?? null;

// Route requests
switch ($method) {
    case 'GET':
        if ($action === 'health') {
            // Health check
            sendResponse([
                'status' => 'ok',
                'message' => 'Server is running',
                'timestamp' => date('Y-m-d H:i:s')
            ]);
        } elseif ($id !== null) {
            // Get specific car
            $cars = getCars();
            $car = null;

            foreach ($cars as $c) {
                if ($c['id'] == $id) {
                    $car = $c;
                    break;
                }
            }

            if ($car === null) {
                sendError('Car not found', 404);
            }

            sendResponse($car);
        } else {
            // Get all cars
            $cars = getCars();
            sendResponse($cars);
        }
        break;

    case 'POST':
        // Save all cars (replace entire dataset)
        $input = file_get_contents('php://input');
        $cars = json_decode($input, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            sendError('Invalid JSON data: ' . json_last_error_msg(), 400);
        }

        if (!is_array($cars)) {
            sendError('Invalid data format - expected an array', 400);
        }

        // Validate each car
        foreach ($cars as $car) {
            if (!isset($car['id']) || !isset($car['make']) || !isset($car['model'])) {
                sendError('Invalid car data - missing required fields (id, make, model)', 400);
            }
        }

        // Save to file
        if (!saveCars($cars)) {
            sendError('Failed to save cars data', 500);
        }

        sendResponse([
            'success' => true,
            'message' => count($cars) . ' cars saved successfully',
            'count' => count($cars)
        ]);
        break;

    case 'PUT':
        // Update specific car
        if ($id === null) {
            sendError('Car ID is required', 400);
        }

        $input = file_get_contents('php://input');
        $updatedCar = json_decode($input, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            sendError('Invalid JSON data: ' . json_last_error_msg(), 400);
        }

        $cars = getCars();
        $found = false;

        foreach ($cars as $index => $car) {
            if ($car['id'] == $id) {
                $updatedCar['id'] = (int)$id;
                $cars[$index] = $updatedCar;
                $found = true;
                break;
            }
        }

        if (!$found) {
            sendError('Car not found', 404);
        }

        if (!saveCars($cars)) {
            sendError('Failed to save cars data', 500);
        }

        sendResponse([
            'success' => true,
            'message' => 'Car updated successfully',
            'car' => $updatedCar
        ]);
        break;

    case 'DELETE':
        // Delete specific car
        if ($id === null) {
            sendError('Car ID is required', 400);
        }

        $cars = getCars();
        $newCars = [];
        $found = false;

        foreach ($cars as $car) {
            if ($car['id'] == $id) {
                $found = true;
                continue;
            }
            $newCars[] = $car;
        }

        if (!$found) {
            sendError('Car not found', 404);
        }

        if (!saveCars($newCars)) {
            sendError('Failed to save cars data', 500);
        }

        sendResponse([
            'success' => true,
            'message' => 'Car deleted successfully'
        ]);
        break;

    default:
        sendError('Method not allowed', 405);
}
