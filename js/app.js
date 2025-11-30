/**
 * Autocredit Romania - Car Listing Application
 * Main JavaScript file for car inventory management
 */

// Global State
let carsData = [];
let filteredCars = [];

// DOM Elements
const grid = document.getElementById('cars-grid');
const searchInput = document.getElementById('searchInput');
const sortInput = document.getElementById('sortInput');

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
 * Render car cards to the grid
 * @param {Array} cars - Array of car objects to render
 */
function renderCars(cars) {
    if (!grid) {
        console.error('Cars grid element not found');
        return;
    }

    if (cars.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-16">
                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-xl font-semibold text-gray-600">Nu am găsit nicio mașină</p>
                <p class="text-gray-500 mt-2">Încercați să modificați filtrele de căutare</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = cars.map(car => `
        <a href="car-detail.html?id=${car.id}" class="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-primary-600 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 car-card fade-in">
            <div class="relative h-64 overflow-hidden bg-gray-100">
                <img src="${car.image}"
                     alt="${car.make} ${car.model}"
                     class="w-full h-full object-cover car-image"
                     loading="lazy">
                ${car.verified ? `
                <div class="absolute top-4 left-4 badge badge-verified">
                    Verificat
                </div>
                ` : ''}
                <div class="absolute top-4 right-4 badge badge-year">
                    ${car.year}
                </div>
            </div>
            <div class="p-6">
                <div class="text-xs font-bold text-accent-500 uppercase tracking-wider mb-1">${car.make}</div>
                <h3 class="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition">${car.model}</h3>

                <div class="space-y-2 mb-4 pb-4 border-b border-gray-100">
                    <div class="flex items-center text-sm text-gray-600">
                        <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span class="font-medium">${formatKm(car.mileage)} km</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                        <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="font-medium">${car.fuel}</span>
                    </div>
                </div>

                <div class="flex justify-between items-center">
                    <div class="text-2xl font-black text-gray-900">${formatMoney(car.price)}</div>
                    <div class="text-primary-600 font-semibold group-hover:translate-x-1 transition flex items-center space-x-1">
                        <span class="text-sm">Vezi</span>
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </a>
    `).join('');
}

/**
 * Filter cars based on search term
 * @param {string} searchTerm - The search query
 */
function filterCars(searchTerm) {
    const term = searchTerm.toLowerCase().trim();

    if (!term) {
        filteredCars = [...carsData];
    } else {
        filteredCars = carsData.filter(car =>
            car.make.toLowerCase().includes(term) ||
            car.model.toLowerCase().includes(term) ||
            car.fuel.toLowerCase().includes(term)
        );
    }

    applySorting(sortInput.value);
}

/**
 * Sort cars based on selected criteria
 * @param {string} sortOrder - 'asc' or 'desc'
 */
function applySorting(sortOrder) {
    const sorted = [...filteredCars].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.price - b.price;
        } else {
            return b.price - a.price;
        }
    });

    renderCars(sorted);
}

/**
 * Load car data from API
 */
async function loadCarsData() {
    try {
        grid.classList.add('loading');

        const response = await fetch('api.php');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        carsData = await response.json();
        filteredCars = [...carsData];

        renderCars(filteredCars);

    } catch (error) {
        console.error('Error loading car data:', error);
        grid.innerHTML = `
            <div class="col-span-full text-center py-16">
                <svg class="w-16 h-16 text-red-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p class="text-xl font-semibold text-gray-600">Eroare la încărcarea mașinilor</p>
                <p class="text-gray-500 mt-2">Vă rugăm să reîncărcați pagina</p>
            </div>
        `;
    } finally {
        grid.classList.remove('loading');
    }
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Search functionality with debouncing
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            filterCars(e.target.value);
        }, 300);
    });

    // Sort functionality
    sortInput.addEventListener('change', (e) => {
        applySorting(e.target.value);
    });
}

/**
 * Initialize the application
 */
function init() {
    initEventListeners();
    loadCarsData();
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatMoney,
        formatKm,
        renderCars,
        filterCars,
        applySorting
    };
}
