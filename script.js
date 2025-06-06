// Mobile menu function
function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('active');
    document.body.style.overflow = document.getElementById('mobileMenu').classList.contains('active') ? 'hidden' : 'auto';
    document.getElementById('mobileMenu').style.display = document.getElementById('mobileMenu').classList.contains('active') ? 'block' : 'none';
}

// Cookie consent functions
function updateGtagConsent(ad_storage_status, analytics_storage_status) {
    gtag('consent', 'update', {
        'ad_storage': ad_storage_status,
        'analytics_storage': analytics_storage_status,
        'ad_user_data': ad_storage_status,
        'ad_personalization': ad_storage_status,
    });
}

function saveConsentPreferences() {
    const preferences = {
        analytics_storage: document.getElementById('analyticsConsent').checked ? 'granted' : 'denied',
        ad_storage: document.getElementById('marketingConsent').checked ? 'granted' : 'denied',
        functionality_storage: 'granted',
        personalization_storage: 'granted',
        security_storage: 'granted'
    };
    localStorage.setItem('verza_cookie_consent', JSON.stringify(preferences));
    updateGtagConsent(preferences.ad_storage, preferences.analytics_storage);
    closeCookieConsentBanner();
}

function acceptAllCookies() {
    document.getElementById('analyticsConsent').checked = true;
    document.getElementById('marketingConsent').checked = true;
    saveConsentPreferences();
}

function rejectAllCookies() {
    document.getElementById('analyticsConsent').checked = false;
    document.getElementById('marketingConsent').checked = false;
    saveConsentPreferences();
}

function toggleCookieSettings() {
    document.getElementById('cookieSettings').classList.toggle('active');
}

function closeCookieConsentBanner() {
    document.getElementById('cookieConsentBanner').classList.remove('active');
    document.getElementById('cookieSettings').classList.remove('active');
}

// Contact sales modal functions
function openContactSalesModal() {
    document.getElementById('contactSalesModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeContactSalesModal() {
    document.getElementById('contactSalesModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('contactSalesForm').reset();
    document.getElementById('contactSuccessMessage').classList.add('hidden');
    document.getElementById('contactErrorMessage').classList.add('hidden');
}

// Form submission handler
async function handleContactFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const submitSpinner = document.getElementById('submitSpinner');
    const submitText = document.getElementById('submitText');
    const successMessage = document.getElementById('contactSuccessMessage');
    const errorMessage = document.getElementById('contactErrorMessage');
    
    // Hide any existing messages
    successMessage.classList.add('hidden');
    errorMessage.classList.add('hidden');
    
    // Validate form
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    submitButton.disabled = true;
    submitSpinner.classList.remove('hidden');
    submitText.textContent = 'Sending...';
    
    try {
        const formData = new FormData(form);
        const response = await fetch('https://formspree.io/f/mkgradwv', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            form.reset();
            successMessage.classList.remove('hidden');
            errorMessage.classList.add('hidden');
            setTimeout(closeContactSalesModal, 2500);
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        errorMessage.classList.remove('hidden');
        successMessage.classList.add('hidden');
    } finally {
        submitButton.disabled = false;
        submitSpinner.classList.add('hidden');
        submitText.textContent = 'Send Inquiry';
    }
}

// Handle floating labels
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.form-input');
    
    function handleInput(input) {
        const label = input.nextElementSibling;
        if (input.value || document.activeElement === input) {
            label.classList.add('floating');
        } else {
            label.classList.remove('floating');
        }
    }

    inputs.forEach(input => {
        // Initial check
        handleInput(input);
        
        // Add event listeners
        input.addEventListener('focus', () => handleInput(input));
        input.addEventListener('blur', () => handleInput(input));
        input.addEventListener('input', () => handleInput(input));
    });
});

// Load saved consent preferences
document.addEventListener('DOMContentLoaded', function() {
    const savedConsent = localStorage.getItem('verza_cookie_consent');
    if (savedConsent) {
        const preferences = JSON.parse(savedConsent);
        document.getElementById('analyticsConsent').checked = preferences.analytics_storage === 'granted';
        document.getElementById('marketingConsent').checked = preferences.ad_storage === 'granted';
        updateGtagConsent(preferences.ad_storage, preferences.analytics_storage);
        document.getElementById('cookieConsentBanner').classList.remove('active');
    } else {
        document.getElementById('cookieConsentBanner').classList.add('active');
    }

    // Add form submit handler
    document.getElementById('contactSalesForm').addEventListener('submit', handleContactFormSubmit);
});
