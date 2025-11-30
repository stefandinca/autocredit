/**
 * Autocredit Romania - Car Detail Page
 * Handles individual car detail page functionality
 */

// Global State
let allCars = [];
let currentCar = null;
let currentImageIndex = 0;
let thumbnailStartIndex = 0;
const THUMBNAILS_PER_PAGE = 4;

// DOM Elements
const loadingElement = document.getElementById('loading');
const carContentElement = document.getElementById('car-content');

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
 * Get car ID from URL parameters
 * @returns {number|null} Car ID or null if not found
 */
function getCarIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    return id ? parseInt(id) : null;
}

/**
 * Render car features section
 * @param {Object} features - Object containing exterior and interior features
 */
function renderFeatures(features) {
    if (!features || (!features.exterior && !features.interior)) {
        return '';
    }

    const renderFeatureList = (featureArray) => {
        if (!featureArray || featureArray.length === 0) {
            return '<li class="text-gray-500 italic">Informații indisponibile</li>';
        }

        return featureArray.map(feature => `
            <li class="flex items-center text-gray-700">
                <svg class="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span>${feature}</span>
            </li>
        `).join('');
    };

    const exteriorHTML = features.exterior ? `
        <div>
            <h3 class="font-bold text-xl text-gray-900 mb-5 flex items-center">
                <div class="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                Exterior
            </h3>
            <ul class="space-y-3">
                ${renderFeatureList(features.exterior)}
            </ul>
        </div>
    ` : '';

    const interiorHTML = features.interior ? `
        <div>
            <h3 class="font-bold text-xl text-gray-900 mb-5 flex items-center">
                <div class="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                Interior
            </h3>
            <ul class="space-y-3">
                ${renderFeatureList(features.interior)}
            </ul>
        </div>
    ` : '';

    return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            ${exteriorHTML}
            ${interiorHTML}
        </div>
    `;
}

/**
 * Render similar cars section
 * @param {Array} cars - Array of car objects (excluding current car)
 */
function renderSimilarCars(cars) {
    const similarCarsContainer = document.getElementById('similar-cars');

    if (!similarCarsContainer) return;

    if (cars.length === 0) {
        similarCarsContainer.innerHTML = `
            <div class="col-span-full text-center py-8">
                <p class="text-gray-500">Nu există alte mașini disponibile momentan</p>
            </div>
        `;
        return;
    }

    similarCarsContainer.innerHTML = cars.map(car => `
        <a href="car-detail.html?id=${car.id}" class="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-primary-600 hover:shadow-2xl transition-all duration-300">
            <div class="relative h-48 overflow-hidden bg-gray-100">
                <img src="${car.image}"
                     alt="${car.make} ${car.model}"
                     class="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                     loading="lazy">
            </div>
            <div class="p-5">
                <div class="text-xs font-bold text-accent-500 uppercase tracking-wider mb-1">${car.make}</div>
                <h3 class="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition">${car.model}</h3>
                <div class="flex items-center text-sm text-gray-500 mb-4">
                    <span>${car.year}</span>
                    <span class="mx-2 text-gray-300">•</span>
                    <span>${formatKm(car.mileage)} km</span>
                </div>
                <div class="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span class="text-xl font-black text-gray-900">${formatMoney(car.price)}</span>
                    <span class="text-primary-600 text-sm font-semibold group-hover:translate-x-1 transition flex items-center">
                        Vezi
                        <svg class="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            </div>
        </a>
    `).join('');
}

/**
 * Change the main displayed image
 * @param {number} index - Index of the image to display
 */
function changeImage(index) {
    if (!currentCar || !currentCar.images || index < 0 || index >= currentCar.images.length) {
        return;
    }

    currentImageIndex = index;

    const mainImage = document.getElementById('main-image');
    if (mainImage) {
        mainImage.src = currentCar.images[index];
        mainImage.alt = `${currentCar.make} ${currentCar.model} - Image ${index + 1}`;
    }

    // Update image counter
    const imageCounter = document.getElementById('image-counter');
    if (imageCounter) {
        imageCounter.textContent = `${index + 1} / ${currentCar.images.length}`;
    }

    // Update zoomed image if modal is open
    const zoomedImage = document.getElementById('zoomed-image');
    const zoomImageCounter = document.getElementById('zoom-image-counter');
    if (zoomedImage && document.getElementById('image-zoom-modal').classList.contains('flex')) {
        zoomedImage.src = currentCar.images[index];
        zoomedImage.alt = `${currentCar.make} ${currentCar.model} - Image ${index + 1}`;
        if (zoomImageCounter) {
            zoomImageCounter.textContent = `${index + 1} / ${currentCar.images.length}`;
        }
    }

    // Update active thumbnail
    updateActiveThumbnail(index);
}

/**
 * Update active thumbnail styling
 * @param {number} activeIndex - Index of the active thumbnail
 */
function updateActiveThumbnail(activeIndex) {
    if (!currentCar || !currentCar.images) return;

    // Check if active thumbnail is visible in current page
    const isVisible = activeIndex >= thumbnailStartIndex &&
                     activeIndex < thumbnailStartIndex + THUMBNAILS_PER_PAGE;

    // If not visible, scroll to show it
    if (!isVisible) {
        // Calculate which page the active thumbnail is on
        thumbnailStartIndex = Math.floor(activeIndex / THUMBNAILS_PER_PAGE) * THUMBNAILS_PER_PAGE;
        renderImageGallery(currentCar.images);
        return;
    }

    // Update styling for visible thumbnails
    const thumbnailContainer = document.getElementById('thumbnail-container');
    if (!thumbnailContainer) return;

    const thumbnails = thumbnailContainer.children;
    Array.from(thumbnails).forEach((thumbDiv, displayIndex) => {
        const actualIndex = thumbnailStartIndex + displayIndex;
        if (actualIndex === activeIndex) {
            thumbDiv.classList.add('ring-4', 'ring-primary-600', 'opacity-100');
            thumbDiv.classList.remove('opacity-60');
        } else {
            thumbDiv.classList.remove('ring-4', 'ring-primary-600', 'opacity-100');
            thumbDiv.classList.add('opacity-60');
        }
    });
}

/**
 * Navigate to next image
 */
function nextImage() {
    if (!currentCar || !currentCar.images) return;
    const nextIndex = (currentImageIndex + 1) % currentCar.images.length;
    changeImage(nextIndex);
}

/**
 * Navigate to previous image
 */
function previousImage() {
    if (!currentCar || !currentCar.images) return;
    const prevIndex = (currentImageIndex - 1 + currentCar.images.length) % currentCar.images.length;
    changeImage(prevIndex);
}

/**
 * Update thumbnail navigation buttons visibility
 * @param {number} totalImages - Total number of images
 */
function updateThumbnailButtons(totalImages) {
    const prevBtn = document.getElementById('thumb-prev-btn');
    const nextBtn = document.getElementById('thumb-next-btn');

    if (!prevBtn || !nextBtn) return;

    // Only show buttons if there are more than THUMBNAILS_PER_PAGE images
    if (totalImages <= THUMBNAILS_PER_PAGE) {
        prevBtn.classList.add('hidden');
        nextBtn.classList.add('hidden');
        return;
    }

    // Show/hide previous button
    if (thumbnailStartIndex > 0) {
        prevBtn.classList.remove('hidden');
    } else {
        prevBtn.classList.add('hidden');
    }

    // Show/hide next button
    if (thumbnailStartIndex + THUMBNAILS_PER_PAGE < totalImages) {
        nextBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.add('hidden');
    }
}

/**
 * Scroll thumbnails in the given direction
 * @param {number} direction - Direction to scroll (-1 for previous, 1 for next)
 */
function scrollThumbnails(direction) {
    if (!currentCar || !currentCar.images) return;

    const totalImages = currentCar.images.length;
    const newStartIndex = thumbnailStartIndex + (direction * THUMBNAILS_PER_PAGE);

    // Validate new index
    if (newStartIndex < 0 || newStartIndex >= totalImages) {
        return;
    }

    thumbnailStartIndex = newStartIndex;
    renderImageGallery(currentCar.images);
}

/**
 * Render image gallery thumbnails
 * @param {Array} images - Array of image URLs
 */
function renderImageGallery(images) {
    const thumbnailContainer = document.getElementById('thumbnail-container');

    if (!thumbnailContainer || !images || images.length === 0) {
        return;
    }

    // Clear existing thumbnails
    thumbnailContainer.innerHTML = '';

    // Calculate end index for current page
    const endIndex = Math.min(thumbnailStartIndex + THUMBNAILS_PER_PAGE, images.length);

    // Create thumbnails for current page
    for (let i = thumbnailStartIndex; i < endIndex; i++) {
        const imageUrl = images[i];
        const thumbnail = document.createElement('div');
        thumbnail.className = `relative h-24 bg-gray-200 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${i === currentImageIndex ? 'ring-4 ring-primary-600 opacity-100' : 'opacity-60 hover:opacity-100'}`;
        thumbnail.innerHTML = `
            <img src="${imageUrl}"
                 alt="Thumbnail ${i + 1}"
                 class="w-full h-full object-cover thumbnail-image"
                 loading="lazy">
        `;

        // Add click event
        const index = i; // Capture index for closure
        thumbnail.addEventListener('click', () => changeImage(index));

        thumbnailContainer.appendChild(thumbnail);
    }

    // Update navigation buttons
    updateThumbnailButtons(images.length);

    // Add keyboard navigation (only once)
    if (!window.keyboardNavigationAdded) {
        document.addEventListener('keydown', handleKeyboardNavigation);
        window.keyboardNavigationAdded = true;
    }
}

/**
 * Handle keyboard navigation for image gallery
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeyboardNavigation(event) {
    if (!currentCar || !currentCar.images) return;

    if (event.key === 'ArrowLeft') {
        previousImage();
    } else if (event.key === 'ArrowRight') {
        nextImage();
    } else if (event.key === 'Escape') {
        closeImageZoom();
    }
}

/**
 * Open image zoom modal
 */
function openImageZoom() {
    const modal = document.getElementById('image-zoom-modal');
    const zoomedImage = document.getElementById('zoomed-image');
    const zoomImageCounter = document.getElementById('zoom-image-counter');

    if (!modal || !zoomedImage || !currentCar) return;

    // Set the zoomed image source to current image
    zoomedImage.src = currentCar.images[currentImageIndex];
    zoomedImage.alt = `${currentCar.make} ${currentCar.model} - Image ${currentImageIndex + 1}`;

    // Update counter
    if (zoomImageCounter) {
        zoomImageCounter.textContent = `${currentImageIndex + 1} / ${currentCar.images.length}`;
    }

    // Show modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

/**
 * Close image zoom modal
 */
function closeImageZoom() {
    const modal = document.getElementById('image-zoom-modal');

    if (!modal) return;

    // Hide modal
    modal.classList.add('hidden');
    modal.classList.remove('flex');

    // Restore body scroll
    document.body.style.overflow = '';
}

/**
 * Setup click handler for main image zoom
 */
function setupImageZoom() {
    const mainImage = document.getElementById('main-image');
    const modal = document.getElementById('image-zoom-modal');

    if (mainImage) {
        mainImage.style.cursor = 'zoom-in';
        mainImage.addEventListener('click', openImageZoom);
    }

    // Close modal when clicking on background
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeImageZoom();
            }
        });
    }
}

/**
 * Render car details to the page
 * @param {Object} car - Car object to display
 */
function renderCarDetails(car) {
    // Reset image index and thumbnail pagination
    currentImageIndex = 0;
    thumbnailStartIndex = 0;

    // Update page title
    document.title = `${car.make} ${car.model} - Autocredit Romania`;

    // Get images array (fallback to single image if images array doesn't exist)
    const images = car.images || [car.image];

    // Update main image
    const mainImage = document.getElementById('main-image');
    if (mainImage) {
        mainImage.src = images[0];
        mainImage.alt = `${car.make} ${car.model}`;
    }

    // Render image gallery thumbnails
    renderImageGallery(images);

    // Update image counter
    const imageCounter = document.getElementById('image-counter');
    if (imageCounter) {
        imageCounter.textContent = `1 / ${images.length}`;
    }

    // Update car make and model
    const carMake = document.getElementById('car-make');
    const carTitle = document.getElementById('car-title');
    if (carMake) carMake.textContent = car.make;
    if (carTitle) carTitle.textContent = car.model;

    // Update price
    const carPrice = document.getElementById('car-price');
    if (carPrice) carPrice.textContent = formatMoney(car.price);

    // Update specifications
    const specYear = document.getElementById('spec-year');
    const specKm = document.getElementById('spec-km');
    const specFuel = document.getElementById('spec-fuel');
    const specTransmission = document.getElementById('spec-transmission');
    const specBodyType = document.getElementById('spec-body-type');
    const specDisplacement = document.getElementById('spec-displacement');
    const specPower = document.getElementById('spec-power');

    if (specYear) specYear.textContent = car.year;
    if (specKm) specKm.textContent = formatKm(car.mileage) + ' km';
    if (specFuel) specFuel.textContent = car.fuel;
    if (specTransmission) specTransmission.textContent = car.transmission || 'N/A';
    if (specBodyType) specBodyType.textContent = car.bodyType || 'N/A';
    if (specDisplacement) specDisplacement.textContent = car.displacement || 'N/A';
    if (specPower) specPower.textContent = car.power || 'N/A';

    // Update description
    const carDescription = document.getElementById('car-description');
    if (carDescription) {
        carDescription.textContent = car.description || 'Descriere indisponibilă momentan.';
    }

    // Render features
    const featuresContainer = document.getElementById('features-content');
    if (featuresContainer && car.features) {
        featuresContainer.innerHTML = renderFeatures(car.features);
    }

    // Show similar cars (exclude current car, show max 3)
    const similarCars = allCars
        .filter(c => c.id !== car.id)
        .slice(0, 3);
    renderSimilarCars(similarCars);
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    if (loadingElement) {
        loadingElement.innerHTML = `
            <div class="text-center py-20">
                <svg class="w-16 h-16 text-red-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p class="text-xl font-semibold text-gray-600">${message}</p>
                <a href="parc-auto.html" class="inline-block mt-6 text-primary-600 font-semibold hover:text-primary-700 transition">
                    ← Înapoi la Parc Auto
                </a>
            </div>
        `;
    }
}

/**
 * Load car data and render the page
 */
async function loadCarData() {
    try {
        const carId = getCarIdFromURL();

        if (!carId) {
            showError('ID-ul mașinii lipsește din URL');
            return;
        }

        // Load cars data
        const response = await fetch('api.php');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        allCars = await response.json();

        // Find the specific car
        currentCar = allCars.find(car => car.id === carId);

        if (!currentCar) {
            showError('Mașina nu a fost găsită');
            return;
        }

        // Hide loading, show content
        if (loadingElement) loadingElement.style.display = 'none';
        if (carContentElement) carContentElement.classList.remove('hidden');

        // Render car details
        renderCarDetails(currentCar);

    } catch (error) {
        console.error('Error loading car data:', error);
        showError('Eroare la încărcarea detaliilor mașinii. Vă rugăm să reîncărcați pagina.');
    }
}

/**
 * Initialize the page
 */
function init() {
    loadCarData();
    setupImageZoom();
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
        renderFeatures,
        renderSimilarCars,
        renderCarDetails
    };
}
