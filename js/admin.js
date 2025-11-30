/**
 * Autocredit Romania - Admin Panel
 * Manages car inventory - CRUD operations
 */

// Global State
let carsData = [];
let editingCarId = null;
const STORAGE_KEY = 'autocredit_cars_data';

// Utility Functions
const formatMoney = (amount) => {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

const formatKm = (kilometers) => {
    return new Intl.NumberFormat('de-DE').format(kilometers);
};

/**
 * Show alert message
 * @param {string} message - Alert message
 * @param {string} type - Alert type (success, error, warning, info)
 */
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alert-container');
    const colors = {
        success: 'bg-green-100 border-green-500 text-green-700',
        error: 'bg-red-100 border-red-500 text-red-700',
        warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
        info: 'bg-blue-100 border-blue-500 text-blue-700'
    };

    const icons = {
        success: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />',
        error: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />',
        warning: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />',
        info: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />'
    };

    const alertHTML = `
        <div class="border-l-4 ${colors[type]} p-4 rounded-lg shadow-lg flex items-start space-x-3 animate-slide-in">
            <svg class="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                ${icons[type]}
            </svg>
            <div class="flex-1">
                <p class="font-semibold">${message}</p>
            </div>
            <button onclick="this.parentElement.remove()" class="text-gray-500 hover:text-gray-700">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    `;

    alertContainer.innerHTML = alertHTML;

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertContainer.firstElementChild) {
            alertContainer.firstElementChild.remove();
        }
    }, 5000);
}

/**
 * Load cars from localStorage or fetch from JSON
 */
async function loadCars() {
    try {
        // First, try to load from localStorage
        const storedData = localStorage.getItem(STORAGE_KEY);

        if (storedData) {
            carsData = JSON.parse(storedData);
            console.log('Loaded cars from localStorage');
        } else {
            // If no localStorage data, fetch from JSON file
            const response = await fetch('data/cars.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            carsData = await response.json();
            // Save to localStorage
            saveCarsToStorage();
            console.log('Loaded cars from JSON file');
        }

        renderCarsList();
    } catch (error) {
        console.error('Error loading cars:', error);
        showAlert('Error loading cars data. Please check the console.', 'error');
        carsData = [];
        renderCarsList();
    }
}

/**
 * Save cars to localStorage
 */
function saveCarsToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carsData));
    console.log('Saved cars to localStorage');
}

/**
 * Generate new ID for a car
 * @returns {number} New unique ID
 */
function generateNewId() {
    if (carsData.length === 0) return 1;
    const maxId = Math.max(...carsData.map(car => car.id));
    return maxId + 1;
}

/**
 * Render cars list
 */
function renderCarsList() {
    const carsList = document.getElementById('cars-list');
    const emptyState = document.getElementById('empty-state');

    if (!carsData || carsData.length === 0) {
        carsList.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    carsList.innerHTML = carsData.map(car => `
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div class="flex flex-col md:flex-row">
                <!-- Car Image -->
                <div class="md:w-64 h-48 md:h-auto bg-gray-100 flex-shrink-0">
                    <img src="${car.image}" alt="${car.make} ${car.model}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                </div>

                <!-- Car Details -->
                <div class="flex-1 p-6">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <div class="flex items-center space-x-2 mb-2">
                                <span class="text-xs font-bold text-accent-500 uppercase tracking-wider">${car.make}</span>
                                ${car.verified ? '<span class="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Verified</span>' : ''}
                            </div>
                            <h3 class="text-2xl font-black text-gray-900 mb-2">${car.model}</h3>
                            <p class="text-3xl font-black text-accent-500">${formatMoney(car.price)}</p>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button onclick="editCar(${car.id})" class="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition" title="Edit">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button onclick="deleteCar(${car.id})" class="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition" title="Delete">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <p class="text-xs text-gray-500">Year</p>
                            <p class="font-bold text-gray-900">${car.year}</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500">Mileage</p>
                            <p class="font-bold text-gray-900">${formatKm(car.mileage)} km</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500">Fuel</p>
                            <p class="font-bold text-gray-900">${car.fuel}</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500">Transmission</p>
                            <p class="font-bold text-gray-900">${car.transmission || 'N/A'}</p>
                        </div>
                    </div>

                    ${car.description ? `
                    <div class="border-t border-gray-100 pt-4">
                        <p class="text-sm text-gray-600 line-clamp-2">${car.description}</p>
                    </div>
                    ` : ''}

                    <div class="border-t border-gray-100 pt-4 mt-4">
                        <div class="flex items-center justify-between text-xs text-gray-500">
                            <span>ID: ${car.id}</span>
                            <span>${car.images ? car.images.length : 1} image(s)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Open add car modal
 */
function openAddCarModal() {
    editingCarId = null;
    document.getElementById('modal-title').textContent = 'Add New Car';
    document.getElementById('car-form').reset();
    document.getElementById('car-modal').classList.remove('hidden');
    document.getElementById('car-modal').classList.add('flex');
}

/**
 * Open edit car modal
 * @param {number} carId - ID of car to edit
 */
function editCar(carId) {
    const car = carsData.find(c => c.id === carId);
    if (!car) {
        showAlert('Car not found!', 'error');
        return;
    }

    editingCarId = carId;
    document.getElementById('modal-title').textContent = 'Edit Car';

    // Populate form
    document.getElementById('input-make').value = car.make || '';
    document.getElementById('input-model').value = car.model || '';
    document.getElementById('input-year').value = car.year || '';
    document.getElementById('input-price').value = car.price || '';
    document.getElementById('input-mileage').value = car.mileage || '';
    document.getElementById('input-fuel').value = car.fuel || '';
    document.getElementById('input-transmission').value = car.transmission || '';
    document.getElementById('input-body-type').value = car.bodyType || '';
    document.getElementById('input-displacement').value = car.displacement || '';
    document.getElementById('input-power').value = car.power || '';
    document.getElementById('input-image').value = car.image || '';
    document.getElementById('input-description').value = car.description || '';
    document.getElementById('input-verified').checked = car.verified || false;

    // Populate images
    if (car.images && Array.isArray(car.images)) {
        document.getElementById('input-images').value = car.images.join('\n');
    }

    // Populate features
    if (car.features) {
        if (car.features.exterior && Array.isArray(car.features.exterior)) {
            document.getElementById('input-exterior').value = car.features.exterior.join('\n');
        }
        if (car.features.interior && Array.isArray(car.features.interior)) {
            document.getElementById('input-interior').value = car.features.interior.join('\n');
        }
    }

    // Open modal
    document.getElementById('car-modal').classList.remove('hidden');
    document.getElementById('car-modal').classList.add('flex');
}

/**
 * Close car modal
 */
function closeCarModal() {
    document.getElementById('car-modal').classList.add('hidden');
    document.getElementById('car-modal').classList.remove('flex');
    document.getElementById('car-form').reset();
    editingCarId = null;
}

/**
 * Delete car
 * @param {number} carId - ID of car to delete
 */
function deleteCar(carId) {
    const car = carsData.find(c => c.id === carId);
    if (!car) {
        showAlert('Car not found!', 'error');
        return;
    }

    if (confirm(`Are you sure you want to delete ${car.make} ${car.model}?`)) {
        carsData = carsData.filter(c => c.id !== carId);
        saveCarsToStorage();
        renderCarsList();
        showAlert(`${car.make} ${car.model} deleted successfully!`, 'success');
    }
}

/**
 * Handle form submission
 */
document.getElementById('car-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const carData = {
        make: document.getElementById('input-make').value.trim(),
        model: document.getElementById('input-model').value.trim(),
        year: parseInt(document.getElementById('input-year').value),
        price: parseInt(document.getElementById('input-price').value),
        mileage: parseInt(document.getElementById('input-mileage').value),
        fuel: document.getElementById('input-fuel').value.trim(),
        transmission: document.getElementById('input-transmission').value.trim(),
        bodyType: document.getElementById('input-body-type').value.trim(),
        displacement: document.getElementById('input-displacement').value.trim(),
        power: document.getElementById('input-power').value.trim(),
        image: document.getElementById('input-image').value.trim(),
        description: document.getElementById('input-description').value.trim(),
        verified: document.getElementById('input-verified').checked
    };

    // Parse images (one per line)
    const imagesText = document.getElementById('input-images').value.trim();
    if (imagesText) {
        carData.images = imagesText.split('\n').map(img => img.trim()).filter(img => img);
    } else {
        carData.images = [carData.image];
    }

    // Parse features
    carData.features = {};

    const exteriorText = document.getElementById('input-exterior').value.trim();
    if (exteriorText) {
        carData.features.exterior = exteriorText.split('\n').map(f => f.trim()).filter(f => f);
    }

    const interiorText = document.getElementById('input-interior').value.trim();
    if (interiorText) {
        carData.features.interior = interiorText.split('\n').map(f => f.trim()).filter(f => f);
    }

    if (editingCarId !== null) {
        // Update existing car
        const index = carsData.findIndex(c => c.id === editingCarId);
        if (index !== -1) {
            carData.id = editingCarId;
            carsData[index] = carData;
            showAlert(`${carData.make} ${carData.model} updated successfully!`, 'success');
        }
    } else {
        // Add new car
        carData.id = generateNewId();
        carsData.push(carData);
        showAlert(`${carData.make} ${carData.model} added successfully!`, 'success');
    }

    // Save and refresh
    saveCarsToStorage();
    renderCarsList();
    closeCarModal();
});

/**
 * Export cars data as JSON file
 */
function exportJSON() {
    const dataStr = JSON.stringify(carsData, null, 4);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'cars.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showAlert('Cars data exported successfully! Check your downloads folder.', 'success');
}

/**
 * Import cars data from JSON file
 * @param {Event} event - File input change event
 */
function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);

            // Validate data
            if (!Array.isArray(importedData)) {
                throw new Error('Invalid JSON format - expected an array');
            }

            // Basic validation of car objects
            for (const car of importedData) {
                if (!car.id || !car.make || !car.model) {
                    throw new Error('Invalid car data - missing required fields (id, make, model)');
                }
            }

            // Ask for confirmation
            if (confirm(`Import ${importedData.length} cars? This will replace the current data.`)) {
                carsData = importedData;
                saveCarsToStorage();
                renderCarsList();
                showAlert(`Successfully imported ${importedData.length} cars!`, 'success');
            }
        } catch (error) {
            console.error('Import error:', error);
            showAlert(`Error importing JSON: ${error.message}`, 'error');
        }
    };

    reader.readAsText(file);

    // Reset file input
    event.target.value = '';
}

/**
 * Close modal when clicking outside
 */
document.getElementById('car-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeCarModal();
    }
});

/**
 * Handle keyboard shortcuts
 */
document.addEventListener('keydown', function(e) {
    // ESC to close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('car-modal');
        if (modal.classList.contains('flex')) {
            closeCarModal();
        }
    }
});

/**
 * Initialize the admin panel
 */
function init() {
    loadCars();
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
