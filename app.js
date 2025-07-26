/**
 * MediLink - Healthcare App JavaScript
 * "Your Health. Our Mission."
 * 
 * Features:
 * - Screen navigation and management
 * - Blood request functionality
 * - Prescription scanning simulation
 * - Donor mapping and matching
 * - Medicine search and information
 * - Reminders management
 * - Medical records handling
 * - User profile management
 * - Emergency contact system
 * - Lore/story presentation
 */

// Global app state
let currentScreen = 'splash-screen';
let currentUser = {
    name: 'John Doe',
    email: 'john.doe@email.com',
    bloodType: 'O+',
    phone: '+1 234-567-8900',
    donations: 5,
    rating: 4.9
};

let appData = {
    bloodRequest: {
        type: 'O+',
        units: 2,
        urgency: 'critical',
        hospital: 'City General Hospital',
        contact: '+1 234-567-8900'
    },
    reminders: [
        {
            id: 1,
            name: 'Blood Pressure Medication',
            frequency: 'Every day at 9:00 AM',
            nextDose: 'Today 9:00 AM',
            active: true,
            icon: 'fas fa-pills'
        },
        {
            id: 2,
            name: 'Insulin Injection',
            frequency: 'Before meals',
            nextDose: 'Today 12:30 PM',
            active: true,
            icon: 'fas fa-syringe'
        },
        {
            id: 3,
            name: 'Doctor Appointment',
            frequency: 'Dr. Smith - Cardiology',
            nextDose: 'Tomorrow 2:00 PM',
            active: true,
            icon: 'fas fa-calendar-check'
        }
    ],
    donors: [
        {
            id: 'donor1',
            name: 'Sarah Johnson',
            bloodType: 'O+',
            distance: '2.3 km',
            availability: 'available',
            rating: 4.9,
            lastDonation: '2 weeks ago'
        },
        {
            id: 'donor2',
            name: 'Michael Chen',
            bloodType: 'A+',
            distance: '3.7 km',
            availability: 'busy',
            rating: 4.7,
            lastDonation: '1 month ago'
        },
        {
            id: 'donor3',
            name: 'Emma Rodriguez',
            bloodType: 'B-',
            distance: '1.8 km',
            availability: 'available',
            rating: 4.8,
            lastDonation: '3 weeks ago'
        }
    ]
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    startSplashScreen();
});

/**
 * Initialize the application
 */
function initializeApp() {
    console.log('🩸 MediLink - Initializing Healthcare App...');
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize bottom navigation
    setupBottomNavigation();
    
    // Set up emergency modal
    setupEmergencyModal();
    
    // Initialize interactive elements
    setupInteractiveElements();
    
    console.log('✅ MediLink - App initialized successfully!');
}

/**
 * Start splash screen animation
 */
function startSplashScreen() {
    // Auto-transition to auth screen after 3 seconds
    setTimeout(() => {
        showScreen('auth-screen');
    }, 3000);
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Urgency level buttons
    document.querySelectorAll('.urgency-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.urgency-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            appData.bloodRequest.urgency = this.dataset.level;
        });
    });
    
    // Blood type buttons
    document.querySelectorAll('.blood-type-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.blood-type-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            appData.bloodRequest.type = this.dataset.type;
        });
    });
    
    // Filter tabs for medical records
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            filterMedicalRecords(this.dataset.filter);
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('medicine-search');
    if (searchInput) {
        searchInput.addEventListener('input', handleMedicineSearch);
    }
}

/**
 * Set up bottom navigation
 */
function setupBottomNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            navButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/**
 * Set up emergency modal
 */
function setupEmergencyModal() {
    const modal = document.getElementById('emergency-modal');
    const emergencyBtns = document.querySelectorAll('.emergency-btn, .nav-btn.emergency');
    
    emergencyBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            showEmergencyOptions();
        });
    });
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

/**
 * Set up interactive elements
 */
function setupInteractiveElements() {
    // Add pulse animation to blood drop icons
    const bloodDrops = document.querySelectorAll('.blood-drop-icon, .blood-drop-small');
    bloodDrops.forEach(drop => {
        drop.addEventListener('mouseenter', function() {
            this.style.animation = 'pulse 0.5s ease-in-out';
        });
        
        drop.addEventListener('animationend', function() {
            this.style.animation = 'pulse 2s infinite';
        });
    });
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.card, .donor-card, .medicine-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Screen navigation functions
 */
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenId;
        
        // Update bottom nav if needed
        updateBottomNavForScreen(screenId);
        
        // Screen-specific initializations
        onScreenShow(screenId);
    }
}

function goBack() {
    // Navigate back to home screen or previous screen
    const backRoutes = {
        'blood-request': 'home-screen',
        'scan-prescription': 'home-screen',
        'search-medicine': 'home-screen',
        'reminders': 'home-screen',
        'medical-records': 'home-screen',
        'donor-map': 'home-screen',
        'profile': 'home-screen',
        'lore-screen': 'home-screen'
    };
    
    const backTo = backRoutes[currentScreen] || 'home-screen';
    showScreen(backTo);
}

function goToHome() {
    showScreen('home-screen');
}

/**
 * Update bottom navigation for current screen
 */
function updateBottomNavForScreen(screenId) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
    
    const screenNavMap = {
        'home-screen': 0,
        'donor-map': 1,
        'blood-request': 2,
        'medical-records': 3,
        'profile': 4
    };
    
    const navIndex = screenNavMap[screenId];
    if (navIndex !== undefined && navButtons[navIndex]) {
        navButtons[navIndex].classList.add('active');
    }
}

/**
 * Handle screen-specific initialization
 */
function onScreenShow(screenId) {
    switch (screenId) {
        case 'donor-map':
            initializeDonorMap();
            break;
        case 'scan-prescription':
            startScanAnimation();
            break;
        case 'lore-screen':
            startLoreAnimations();
            break;
        case 'reminders':
            updateReminderStats();
            break;
    }
}

/**
 * Authentication functions
 */
function switchTab(tabName) {
    // Hide all forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    
    // Remove active state from tabs
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected form and tab
    document.getElementById(tabName + '-form').classList.add('active');
    event.target.classList.add('active');
}

/**
 * Blood request functions
 */
function changeUnits(delta) {
    const unitCountElement = document.querySelector('.unit-count');
    let currentUnits = parseInt(unitCountElement.textContent);
    currentUnits += delta;
    
    // Ensure minimum of 1 unit
    if (currentUnits < 1) currentUnits = 1;
    if (currentUnits > 10) currentUnits = 10; // Maximum reasonable limit
    
    unitCountElement.textContent = currentUnits;
    appData.bloodRequest.units = currentUnits;
}

function submitBloodRequest() {
    // Show loading state
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Request...';
    button.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;
        
        // Show success message
        showSuccessMessage('Emergency blood request sent successfully! Donors are being notified.');
        
        // Redirect to donor map
        setTimeout(() => {
            showScreen('donor-map');
        }, 2000);
    }, 2000);
}

/**
 * Scanner functions
 */
function startScanAnimation() {
    const scanLine = document.querySelector('.scan-line');
    if (scanLine) {
        scanLine.style.animation = 'scanAnimation 2s ease-in-out infinite';
    }
}

function toggleFlash() {
    const flashBtn = event.target.closest('.control-btn');
    flashBtn.classList.toggle('active');
    
    // Visual feedback
    if (flashBtn.classList.contains('active')) {
        flashBtn.style.background = 'var(--warning-orange)';
        flashBtn.style.color = 'white';
    } else {
        flashBtn.style.background = 'var(--medium-gray)';
        flashBtn.style.color = 'var(--charcoal)';
    }
}

function scanPrescription() {
    const button = event.target;
    const originalText = button.innerHTML;
    
    // Show scanning state
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scanning...';
    button.disabled = true;
    
    // Simulate scanning process
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
        
        // Show success message
        showSuccessMessage('Prescription scanned successfully! Added to your medical records.');
        
        // Add new scan item (simulate)
        addRecentScan('Heart Medication', 'Just now');
    }, 3000);
}

function selectFromGallery() {
    // Simulate file picker
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        if (e.target.files.length > 0) {
            showSuccessMessage('Image selected from gallery. Processing...');
            setTimeout(() => {
                scanPrescription();
            }, 1000);
        }
    };
    input.click();
}

function addRecentScan(name, time) {
    const recentScans = document.querySelector('.recent-scans');
    const newScan = document.createElement('div');
    newScan.className = 'scan-item';
    newScan.innerHTML = `
        <div class="scan-thumbnail">
            <i class="fas fa-file-prescription"></i>
        </div>
        <div class="scan-info">
            <h5>${name}</h5>
            <p>Scanned ${time}</p>
        </div>
        <button class="view-btn">
            <i class="fas fa-eye"></i>
        </button>
    `;
    
    const existingItems = recentScans.querySelectorAll('.scan-item');
    if (existingItems.length > 0) {
        recentScans.insertBefore(newScan, existingItems[0]);
    } else {
        recentScans.appendChild(newScan);
    }
}

/**
 * Donor map functions
 */
function initializeDonorMap() {
    // Animate donor pins
    const donorPins = document.querySelectorAll('.donor-pin');
    donorPins.forEach((pin, index) => {
        setTimeout(() => {
            pin.style.animation = 'pulse 2s infinite';
        }, index * 500);
    });
}

function showDonorProfile(donorId) {
    const donor = appData.donors.find(d => d.id === donorId);
    if (donor) {
        // Create modal for donor profile
        const modal = createDonorProfileModal(donor);
        document.body.appendChild(modal);
        modal.classList.add('active');
    }
}

function createDonorProfileModal(donor) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${donor.name}</h3>
            <div class="donor-profile-details">
                <p><strong>Blood Type:</strong> ${donor.bloodType}</p>
                <p><strong>Distance:</strong> ${donor.distance} away</p>
                <p><strong>Rating:</strong> ${donor.rating} ⭐</p>
                <p><strong>Last Donation:</strong> ${donor.lastDonation}</p>
                <p><strong>Status:</strong> <span class="availability ${donor.availability}">${donor.availability}</span></p>
            </div>
            <div class="donor-actions">
                <button class="cta-btn" onclick="contactDonor('${donor.id}')">
                    <i class="fas fa-phone"></i> Contact Donor
                </button>
                <button class="cta-btn" onclick="requestDonation('${donor.id}')">
                    <i class="fas fa-tint"></i> Request Donation
                </button>
            </div>
            <button class="modal-close" onclick="closeDonorProfile()">Close</button>
        </div>
    `;
    
    return modal;
}

function contactDonor(donorId) {
    const donor = appData.donors.find(d => d.id === donorId);
    showSuccessMessage(`Calling ${donor.name}...`);
    closeDonorProfile();
}

function requestDonation(donorId) {
    const donor = appData.donors.find(d => d.id === donorId);
    showSuccessMessage(`Donation request sent to ${donor.name}. They will be notified immediately.`);
    closeDonorProfile();
}

function closeDonorProfile() {
    const modal = document.querySelector('.modal.active');
    if (modal) {
        modal.remove();
    }
}

function showFilters() {
    // Show filter options for donor search
    showSuccessMessage('Filter options: Blood type, Distance, Availability');
}

/**
 * Medicine search functions
 */
function handleMedicineSearch(event) {
    const query = event.target.value.toLowerCase();
    
    if (query.length > 2) {
        // Simulate API search
        searchMedicines(query);
    }
}

function searchMedicines(query) {
    // Simulate medicine database search
    const medicines = [
        {
            name: 'Paracetamol 500mg',
            description: 'Pain relief, fever reducer',
            price: '$8.99',
            availability: 'in-stock'
        },
        {
            name: 'Aspirin 100mg',
            description: 'Blood thinner, heart health',
            price: '$12.50',
            availability: 'low-stock'
        },
        {
            name: 'Ibuprofen 400mg',
            description: 'Anti-inflammatory, pain relief',
            price: '$10.25',
            availability: 'in-stock'
        }
    ];
    
    const results = medicines.filter(med => 
        med.name.toLowerCase().includes(query) || 
        med.description.toLowerCase().includes(query)
    );
    
    updateMedicineResults(results);
}

function updateMedicineResults(medicines) {
    const resultsContainer = document.querySelector('.medicine-results');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = medicines.map(med => `
        <div class="medicine-item">
            <div class="medicine-icon">
                <i class="fas fa-pills"></i>
            </div>
            <div class="medicine-info">
                <h4>${med.name}</h4>
                <p>${med.description}</p>
                <div class="medicine-details">
                    <span class="price">${med.price}</span>
                    <span class="availability ${med.availability.replace('-', '-')}">${med.availability.replace('-', ' ')}</span>
                </div>
            </div>
            <button class="add-btn" onclick="addToRecords('${med.name}')">
                <i class="fas fa-plus"></i>
            </button>
        </div>
    `).join('');
}

function addToRecords(medicineName) {
    showSuccessMessage(`${medicineName} added to your medical records.`);
}

function startVoiceSearch() {
    const button = event.target;
    button.style.background = 'var(--success-green)';
    
    // Simulate voice recognition
    setTimeout(() => {
        button.style.background = 'var(--primary-red)';
        document.getElementById('medicine-search').value = 'Paracetamol';
        handleMedicineSearch({ target: { value: 'Paracetamol' } });
    }, 2000);
}

/**
 * Reminders functions
 */
function updateReminderStats() {
    const activeReminders = appData.reminders.filter(r => r.active);
    const adherenceRate = Math.round((activeReminders.length / appData.reminders.length) * 100);
    
    const adherenceElement = document.querySelector('.stat-card .stat-number');
    if (adherenceElement) {
        adherenceElement.textContent = adherenceRate + '%';
    }
}

function showAddReminder() {
    showSuccessMessage('Add Reminder feature coming soon!');
}

/**
 * Medical records functions
 */
function filterMedicalRecords(filter) {
    const records = document.querySelectorAll('.record-item');
    
    records.forEach(record => {
        if (filter === 'all') {
            record.style.display = 'flex';
        } else {
            // Simple filter simulation
            const recordType = record.querySelector('.record-info h4').textContent.toLowerCase();
            const shouldShow = recordType.includes(filter) || 
                             (filter === 'prescriptions' && recordType.includes('prescription')) ||
                             (filter === 'tests' && recordType.includes('test')) ||
                             (filter === 'visits' && recordType.includes('exam'));
            
            record.style.display = shouldShow ? 'flex' : 'none';
        }
    });
}

function downloadRecord(recordId) {
    showSuccessMessage(`Downloading ${recordId}...`);
    
    // Simulate download
    setTimeout(() => {
        showSuccessMessage('Record downloaded successfully!');
    }, 1500);
}

function searchRecords() {
    showSuccessMessage('Search functionality coming soon!');
}

/**
 * Profile functions
 */
function editProfile() {
    showSuccessMessage('Edit profile feature coming soon!');
}

function editPersonalInfo() {
    showSuccessMessage('Edit personal information feature coming soon!');
}

function manageEmergencyContacts() {
    showSuccessMessage('Emergency contacts management coming soon!');
}

function donorSettings() {
    showSuccessMessage('Donor settings feature coming soon!');
}

function privacySettings() {
    showSuccessMessage('Privacy & security settings coming soon!');
}

function notifications() {
    showSuccessMessage('Notification settings feature coming soon!');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showScreen('auth-screen');
        showSuccessMessage('You have been logged out successfully.');
    }
}

/**
 * Emergency functions
 */
function showEmergencyOptions() {
    const modal = document.getElementById('emergency-modal');
    if (modal) {
        modal.classList.add('active');
    }
}

function callEmergency() {
    showSuccessMessage('Calling Emergency Services (911)...');
    closeModal();
}

function notifyContacts() {
    showSuccessMessage('Notifying emergency contacts...');
    closeModal();
}

function shareLocation() {
    showSuccessMessage('Sharing current location with emergency contacts...');
    closeModal();
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('active');
        // Remove dynamically created modals
        if (modal.classList.contains('active') === false && modal.id !== 'emergency-modal') {
            modal.remove();
        }
    });
}

/**
 * Lore/Story functions
 */
function startLoreAnimations() {
    const figures = document.querySelectorAll('.human-figure');
    const lines = document.querySelectorAll('.connection-line');
    
    // Animate figures
    figures.forEach((figure, index) => {
        setTimeout(() => {
            figure.style.animation = 'pulse 3s infinite';
        }, index * 500);
    });
    
    // Animate connection lines
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.style.animation = 'drawLine 2s ease-in-out infinite';
            line.style.animationDelay = `${index * 0.5}s`;
        }, 1000);
    });
}

/**
 * Utility functions
 */
function showSuccessMessage(message) {
    // Create and show toast notification
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add toast styles
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-green);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    // Add CSS for animation if not exists
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .toast-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function showErrorMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification error';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        </div>
    `;
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-red);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

/**
 * PWA Service Worker Registration
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

/**
 * Handle offline/online status
 */
window.addEventListener('online', function() {
    showSuccessMessage('Connection restored. All features are available.');
});

window.addEventListener('offline', function() {
    showErrorMessage('You are offline. Some features may be limited.');
});

/**
 * Keyboard shortcuts
 */
document.addEventListener('keydown', function(e) {
    // Emergency shortcut: Ctrl + E
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        showEmergencyOptions();
    }
    
    // Home shortcut: Ctrl + H
    if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        showScreen('home-screen');
    }
    
    // Blood request shortcut: Ctrl + B
    if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        showScreen('blood-request');
    }
});

/**
 * Touch gestures for mobile
 */
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Swipe right to go back (if significant horizontal movement)
    if (deltaX > 100 && Math.abs(deltaY) < 100) {
        if (currentScreen !== 'home-screen' && currentScreen !== 'splash-screen' && currentScreen !== 'auth-screen') {
            goBack();
        }
    }
    
    // Reset touch coordinates
    touchStartX = 0;
    touchStartY = 0;
});

// Performance monitoring
const perfObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
            console.log('Page Load Time:', entry.loadEventEnd - entry.loadEventStart, 'ms');
        }
    }
});

if (PerformanceObserver.supportedEntryTypes.includes('navigation')) {
    perfObserver.observe({ entryTypes: ['navigation'] });
}

console.log('🩸 MediLink JavaScript loaded successfully!');
console.log('💡 Keyboard shortcuts: Ctrl+E (Emergency), Ctrl+H (Home), Ctrl+B (Blood Request)');
console.log('📱 Swipe right to go back on mobile devices');