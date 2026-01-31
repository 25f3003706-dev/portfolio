<<<<<<< HEAD
<?php
// File to store visitor count
$counterFile = 'data/visitor_count.txt';

// Create data directory if it doesn't exist
if (!is_dir('data')) {
    mkdir('data', 0777, true);
}

// Initialize counter if file doesn't exist
if (!file_exists($counterFile)) {
    file_put_contents($counterFile, '0');
}

// Read current count
$currentCount = (int)file_get_contents($counterFile);

// Increment count
$currentCount++;

// Store updated count
file_put_contents($counterFile, $currentCount);

// Return count as JSON
header('Content-Type: application/json');
echo json_encode(['visitCount' => $currentCount]);
?>
=======
<?php
// File to store visitor count
$counterFile = 'data/visitor_count.txt';

// Create data directory if it doesn't exist
if (!is_dir('data')) {
    mkdir('data', 0777, true);
}

// Initialize counter if file doesn't exist
if (!file_exists($counterFile)) {
    file_put_contents($counterFile, '0');
}

// Read current count
$currentCount = (int)file_get_contents($counterFile);

// Increment count
$currentCount++;

// Store updated count
file_put_contents($counterFile, $currentCount);

// Return count as JSON
header('Content-Type: application/json');
echo json_encode(['visitCount' => $currentCount]);
?>
>>>>>>> 906bd27086164e41065ff5e205e79da4f46ef2a9
