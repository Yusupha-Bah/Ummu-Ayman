// Main JavaScript file for Ummu Ayam School Website

/**
 * ============================================================================
 * INITIALIZATION
 * ============================================================================
 * Initialize the page when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize navigation if nav exists (not on login page)
    if (document.querySelector('nav')) {
        initializeNavigation();
    }
    initializePage();
});

/**
 * ============================================================================
 * NAVIGATION FUNCTIONALITY
 * ============================================================================
 * Handles navigation highlighting and mobile menu toggle
 */

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    // Get current page filename from URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    // Highlight active page in navigation
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        // Check if link matches current page
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active'); // Add active class to highlight
        }
    });

    // Mobile menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        // Toggle mobile menu visibility on button click
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
}

/**
 * ============================================================================
 * PAGE-SPECIFIC INITIALIZATION
 * ============================================================================
 * Initialize specific functionality based on current page
 */
function initializePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Initialize gallery page functionality
    if (currentPage === 'gallery.html') {
        initializeGallery();
    }
    // Initialize contact form functionality
    else if (currentPage === 'contact.html') {
        initializeContactForm();
    }
    // Initialize login page functionality
    else if (currentPage === 'login.html') {
        initializeLogin();
    }
}

/**
 * ============================================================================
 * LOGIN FUNCTIONALITY
 * ============================================================================
 * Handles user authentication using localStorage
 */

// Hardcoded user credentials for testing (in production, use backend validation)
const VALID_USER = {
    username: 'admin',
    password: 'admin123'
};

/**
 * Initialize login page functionality
 */
function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    // Add submit event listener to login form
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
}

/**
 * Handle login form submission and validation
 */
function handleLogin() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const messageDiv = document.getElementById('loginMessage');
    
    if (!usernameInput || !passwordInput) return;
    
    // Get username and password values
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Validate that fields are not empty
    if (!username || !password) {
        showLoginMessage('Please enter both username and password', 'error');
        return;
    }
    
    // Validate credentials against hardcoded user
    if (username === VALID_USER.username && password === VALID_USER.password) {
        // Save login status to localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loggedInUser', username);
        localStorage.setItem('loginTime', new Date().toISOString());
        
        // Show success message
        showLoginMessage('Login successful! Redirecting...', 'success');
        
        // Redirect to index.html after a short delay
        setTimeout(function() {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        // Show error message for invalid credentials
        showLoginMessage('Invalid username or password. Please try again.', 'error');
        passwordInput.value = ''; // Clear password field
    }
}

/**
 * Display login message (error or success)
 * @param {string} text - Message text to display
 * @param {string} type - Message type: 'error' or 'success'
 */
function showLoginMessage(text, type) {
    const messageDiv = document.getElementById('loginMessage');
    if (!messageDiv) return;
    
    // Set message content and style
    messageDiv.textContent = text;
    messageDiv.className = 'login-message ' + type;
    messageDiv.style.display = 'block';
    
    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
        setTimeout(function() {
            messageDiv.style.display = 'none';
        }, 3000);
    }
}

/**
 * ============================================================================
 * GALLERY FUNCTIONALITY
 * ============================================================================
 * Handles dynamic image loading from assets/images folder and localStorage
 */

/**
 * List of Quran Memorization Center image filenames in assets/images folder
 * Update this array to match the actual image filenames in the folder
 */
const ASSETS_IMAGES = [
    'IMG-20250223-WA0061.jpg',
    'IMG-20250223-WA0062.jpg',
    'IMG-20250223-WA0063.jpg',
    'IMG-20250223-WA0064.jpg',
    'IMG-20250223-WA0065.jpg',
    'IMG-20250223-WA0066.jpg'
];

/**
 * Initialize gallery page functionality
 * Loads and displays Quran Memorization images from assets folder
 */
function initializeGallery() {
    // Load and display gallery images from assets folder
    loadGallery();
}

/**
 * Load and display all Quran Memorization images from assets/images folder
 */
function loadGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    // Get images from assets folder only
    const assetsImages = getAssetsImages();
    
    // Show empty message if no images
    if (assetsImages.length === 0) {
        galleryGrid.innerHTML = '<div class="empty-gallery">No images in gallery yet. Add images to the assets/images folder.</div>';
        return;
    }
    
    // Clear existing gallery content
    galleryGrid.innerHTML = '';
    
    // Create gallery items for each image
    assetsImages.forEach((imageUrl, index) => {
        const galleryItem = createGalleryItem(imageUrl, index);
        galleryGrid.appendChild(galleryItem);
    });
}

/**
 * Get image paths from assets/images folder
 * Returns array of image paths
 */
function getAssetsImages() {
    // Map image filenames to full paths in assets/images folder
    return ASSETS_IMAGES.map(filename => `assets/images/${filename}`);
}

/**
 * Create a gallery item element for displaying Quran Memorization images
 * @param {string} imageUrl - Path to the image
 * @param {number} index - Index of the image in the gallery
 * @returns {HTMLElement} - Gallery item element
 */
function createGalleryItem(imageUrl, index) {
    // Create gallery item container
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    
    // Create image element
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = `Quran Memorization Center Image ${index + 1}`;
    img.loading = 'lazy'; // Lazy loading for better performance
    
    // Handle image load error - show placeholder if image fails to load
    img.onerror = function() {
        // Only show placeholder if it's not already a placeholder
        if (!this.src.includes('placeholder')) {
            this.src = 'https://via.placeholder.com/300?text=Image+Not+Found';
        }
    };
    
    // Append image to gallery item
    galleryItem.appendChild(img);
    return galleryItem;
}

/**
 * ============================================================================
 * CONTACT FORM FUNCTIONALITY
 * ============================================================================
 * Handles contact form submission and saves messages to localStorage
 */

/**
 * Initialize contact form functionality
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    // Add submit event listener to contact form
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        handleContactFormSubmit();
    });
}

/**
 * Handle contact form submission with validation
 */
function handleContactFormSubmit() {
    // Get form input elements
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    if (!nameInput || !emailInput || !messageInput) return;
    
    // Get and trim form values
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    
    // Validate that all fields are filled
    if (!name || !email || !message) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Create message data object with timestamp
    const messageData = {
        id: Date.now(), // Unique ID based on timestamp
        name: name,
        email: email,
        message: message,
        date: new Date().toISOString() // ISO format date string
    };
    
    // Get existing messages from localStorage and add new one
    const messages = getMessagesFromStorage();
    messages.push(messageData);
    saveMessagesToStorage(messages);
    
    // Reset form and show success message
    contactForm.reset();
    showMessage('Thank you for your message! We will get back to you soon.', 'success');
}

/**
 * Get contact messages from localStorage
 * @returns {Array} - Array of message objects
 */
function getMessagesFromStorage() {
    const stored = localStorage.getItem('contactMessages');
    return stored ? JSON.parse(stored) : [];
}

/**
 * Save contact messages array to localStorage
 * @param {Array} messages - Array of message objects to save
 */
function saveMessagesToStorage(messages) {
    localStorage.setItem('contactMessages', JSON.stringify(messages));
}

/**
 * ============================================================================
 * UTILITY FUNCTIONS
 * ============================================================================
 */

/**
 * Display a message to the user (success or error)
 * @param {string} text - Message text to display
 * @param {string} type - Message type: 'success' or 'error'
 */
function showMessage(text, type) {
    // Remove any existing messages first
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message element
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = text;
    
    // Find appropriate container and insert message at the top
    const container = document.querySelector('.container') || 
                     document.querySelector('.contact-form') || 
                     document.body;
    container.insertBefore(messageDiv, container.firstChild);
    
    // Auto-remove message after 5 seconds
    setTimeout(function() {
        messageDiv.remove();
    }, 5000);
}
